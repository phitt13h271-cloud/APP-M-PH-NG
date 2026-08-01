import express from "express";
import path from "path";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";



const app = express();
const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  app.get("/api/tts", async (req, res) => {
    try {
      const text = req.query.text as string;
      if (!text || !text.trim()) {
        return res.status(400).send("Text parameter is required");
      }

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text.trim())}`;
      const response = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/"
        }
      });

      if (!response.ok) {
        return res.status(response.status).send("Failed to fetch audio from Google TTS");
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(buffer);
    } catch (error: any) {
      console.error("Error in /api/tts:", error);
      res.status(500).send("TTS error");
    }
  });

  const CANDIDATE_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];

  const SAFETY_SETTINGS = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
  ];

  function extractJson(text: string) {
    let clean = text.trim();
    if (clean.includes('```json')) {
      clean = clean.split('```json')[1].split('```')[0].trim();
    } else if (clean.includes('```')) {
      clean = clean.split('```')[1].split('```')[0].trim();
    }
    return JSON.parse(clean || '{}');
  }

  async function generateContentWithRetry(ai: any, contents: any, config: any) {
    let lastError: any = null;
    config.safetySettings = SAFETY_SETTINGS;
    
    for (const model of CANDIDATE_MODELS) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const res = await ai.models.generateContent({
            model,
            contents,
            config
          });
          if (res && res.text) {
            return res;
          }
        } catch (err: any) {
          lastError = err;
          const errStr = err?.toString() || "";
          const isRateLimit = err?.status === 429 || errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("503");
          if (isRateLimit && attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
          break; // break inner loop, go to next model
        }
      }
    }
    throw lastError || new Error("All Gemini models failed");
  }

  app.post("/api/identify-object", async (req, res) => {
    try {
      const userKey = req.headers["x-api-key"] as string;
      const systemKey = process.env.GEMINI_API_KEY;
      const apiKey = userKey || systemKey;
      if (!apiKey) {
        return res.status(401).json({ error: "API key is missing. Vui lòng cài đặt API Key trong mục Cài đặt." });
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const { imageBase64 } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64." });
      }

      const contents = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
          }
        },
        { text: "Trong hình ảnh, tôi đã vẽ MỘT MŨI TÊN ĐỎ chỉ vào một điểm cụ thể. \n\nYÊU CẦU QUAN TRỌNG: Hãy xác định vị trí mũi tên đó thuộc về ĐỐI TƯỢNG TỔNG THỂ nào trong bức ảnh. \n- TUYỆT ĐỐI KHÔNG nhận diện các chi tiết nhỏ nhặt (Ví dụ: mũi tên chỉ vào phím Space thì phải nhận diện đối tượng là 'Bàn phím'; mũi tên chỉ vào dây cáp của chuột thì nhận diện là 'Con chuột'; mũi tên chỉ vào một linh kiện nhỏ trên mainboard thì nhận diện là 'Bo mạch chủ' hoặc 'Thân máy').\n- Hãy nhìn vào bức tranh lớn, xem vật thể chính mà vị trí đó trực thuộc là gì.\n\nTrả về JSON với:\n- name: Tên ĐỐI TƯỢNG TỔNG THỂ (Tiếng Việt ngắn gọn, ví dụ: 'Bàn phím', 'Chuột', 'Màn hình', 'Bo mạch chủ').\n- function: Giải thích chức năng của đối tượng tổng thể này.\n- real_life_example: Một ví dụ cụ thể liên quan đến đối tượng." }
      ];

      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            function: { type: Type.STRING },
            real_life_example: { type: Type.STRING }
          },
          required: ["name", "function", "real_life_example"]
        }
      };

      let resultJson;
      try {
        const response = await generateContentWithRetry(ai, contents, config);
        const text = response.text || '{}';
        console.log("Raw response text from identify-object:", text);
        resultJson = extractJson(text);
      } catch (genErr: any) {
        console.warn("Error calling AI in identify-object:", genErr);
        if (genErr?.status === 429 || genErr?.message?.includes('Quota') || genErr?.message?.includes('429')) {
          return res.status(429).json({ error: "API quota exceeded. Vui lòng thử lại sau hoặc nhập API Key cá nhân trong phần Cài đặt." });
        }
        return res.status(500).json({ error: `Lỗi AI: ${genErr?.message || genErr?.toString()}` });
      }

      res.json({ result: resultJson });
    } catch (error: any) {
      console.error("Error in /api/identify-object:", error);
      res.status(500).json({ error: "Lỗi kết nối máy chủ phân tích AI." });
    }
  });

  app.post("/api/extract-objects", async (req, res) => {
    try {
      const userKey = req.headers["x-api-key"] as string;
      const systemKey = process.env.GEMINI_API_KEY;
      const apiKey = userKey || systemKey;
      if (!apiKey) {
        return res.status(401).json({ error: "API key is missing. Vui lòng cài đặt API Key trong mục Cài đặt." });
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const { imageBase64 } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64." });
      }

      const contents = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
          }
        },
        { text: `Bạn là chuyên gia thị giác máy tính. YÊU CẦU BẮT BUỘC: Nhận diện TẤT CẢ các đối tượng, hình ảnh minh họa, linh kiện (như Bàn phím, Chuột, Màn hình, Thân máy...) có trong hình ảnh và trả về danh sách chi tiết.

- Phân tích cẩn thận từng vùng trong ảnh. Cứ mỗi thành phần minh họa hoặc đối tượng (dù là ảnh thật hay hình vẽ), hãy coi nó là một đối tượng độc lập.
- KHÔNG BAO GIỜ trả về danh sách rỗng nếu trong ảnh có các đối tượng rõ ràng. Hãy bóc tách hết!
- Đặt tên Tiếng Việt chính xác (Ví dụ: "Màn hình", "Bàn phím", "Trò chơi", "Phần mềm trình chiếu").
- box_2d: Mảng 4 số nguyên [ymin, xmin, ymax, xmax] theo tỷ lệ phần nghìn (0-1000) bao trọn đối tượng đó.` }
      ];

      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  box_2d: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER }
                  }
                },
                required: ["id", "name", "box_2d"]
              }
            }
          },
          required: ["objects"]
        }
      };

      let resultJson;
      try {
        const response = await generateContentWithRetry(ai, contents, config);
        const text = response.text || '{}';
        console.log("Raw response text from extract-objects:", text);
        resultJson = extractJson(text);
      } catch (genErr: any) {
        console.warn("Error calling AI in extract-objects:", genErr);
        if (genErr?.status === 429 || genErr?.message?.includes('Quota') || genErr?.message?.includes('429')) {
          return res.status(429).json({ error: "Hệ thống AI đang bận hoặc hết lượt dùng API. Vui lòng thử lại sau hoặc nhập API Key cá nhân trong phần Cài đặt." });
        }
        return res.status(500).json({ error: "Không thể phân tích hình ảnh từ AI. Vui lòng kiểm tra lại ảnh hoặc API Key." });
      }

      res.json({ result: resultJson });
    } catch (error: any) {
      console.error("Error in /api/extract-objects:", error);
      res.status(500).json({ error: "Lỗi kết nối tới máy chủ phân tích AI." });
    }
  });

  app.post("/api/simulate", async (req, res) => {
    try {
      const userKey = req.headers["x-api-key"] as string;
      const systemKey = process.env.GEMINI_API_KEY;
      const apiKey = userKey || systemKey;
      if (!apiKey) {
        return res.status(401).json({ error: "API key is missing. Vui lòng cài đặt API Key trong mục Cài đặt." });
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const { imageBase64, prompt, description, existingObjects } = req.body;
      const promptText = prompt || description || "Tạo mô phỏng hành động";

      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64." });
      }

      const objectsInfo = existingObjects && existingObjects.length > 0
        ? `\nDanh sách các đối tượng ĐÃ ĐƯỢC NHẬN DIỆN (JSON):\n${JSON.stringify(existingObjects)}`
        : "";

      const contents = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
          }
        },
        { text: `Bạn là AI tạo kịch bản hoạt hình trực quan. Dựa vào hình ảnh, mô tả của người dùng: "${promptText}", và danh sách đối tượng đã biết.
${objectsInfo}

YÊU CẦU BẮT BUỘC:
1. Tạo kịch bản logic mô phỏng yêu cầu (tối thiểu 2 bước).
2. Viết 'message' bằng Tiếng Việt.
3. Nếu cần di chuyển đối tượng, trả về danh sách 'objects' (sử dụng id, name đã biết) và mảng 'moves' bằng CSS transform (vd: 'translate(100px, -50px)').` }
      ];

      const config = {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  box_2d: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER }
                  }
                },
                required: ["id", "name", "box_2d"]
              }
            },
            animation_steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  message: { type: Type.STRING },
                  moves: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        objectId: { type: Type.STRING },
                        target_box_2d: {
                          type: Type.ARRAY,
                          items: { type: Type.INTEGER }
                        },
                        transform: { type: Type.STRING },
                        transformOrigin: { type: Type.STRING }
                      },
                      required: ["objectId"]
                    }
                  }
                },
                required: ["message"]
              }
            }
          },
          required: ["objects", "animation_steps"]
        }
      };

      let resultJson;
      try {
        const response = await generateContentWithRetry(ai, contents, config);
        const text = response.text || '{}';
        console.log("Raw response text from simulate:", text);
        resultJson = extractJson(text);
      } catch (genErr: any) {
        console.warn("Error calling AI in simulate:", genErr);
        if (genErr?.status === 429 || genErr?.message?.includes('Quota') || genErr?.message?.includes('429')) {
          return res.status(429).json({ error: "API quota exceeded. Vui lòng thử lại sau." });
        }
        return res.status(500).json({ error: `Lỗi AI: ${genErr?.message || genErr?.toString()}` });
      }

      res.json({ result: resultJson });
    } catch (error: any) {
      console.error("Error in /api/simulate:", error);
      res.status(500).json({ error: "Lỗi hệ thống khi tạo mô phỏng." });
    }
  });


if (!process.env.VERCEL) {
  (async () => {
    if (process.env.NODE_ENV !== "production") {
      const viteModule = "vite";
      const { createServer: createViteServer } = await import(viteModule);
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })();
}

export default app;
