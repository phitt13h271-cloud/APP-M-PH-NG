import express from "express";
import path from "path";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
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

const CANDIDATE_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"];

async function generateContentWithRetry(ai: any, contents: any, config: any) {
  let lastError: any = null;
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
          console.warn(`Model ${model} hit rate limit on attempt 1, waiting 1.5s before retry...`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        console.warn(`Model ${model} failed on attempt ${attempt}, trying next candidate...`, err?.message || err);
        break;
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
      { text: "Trong hình ảnh, tôi vẽ MỘT MŨI TÊN ĐỎ (chữ thập đỏ) chỉ đúng vào một vị trí cụ thể. Hãy nhìn TẬP TRUNG CHĂM CHÚ vào chính xác điểm mà mũi tên đỏ đang chỉ vào.\n\nNếu mũi tên chỉ vào MỘT LỆNH/CHỮ CỤ THỂ (ví dụ chữ 'Di chuyển 10 bước', 'Quay trái 90 độ'), bạn BẮT BUỘC phải lấy TÊN là nội dung chính xác của lệnh đó (Ví dụ Name='Lệnh: Di chuyển 10 bước'). KHÔNG được trả lời chung chung là 'Lệnh điều khiển' hay 'Đoạn văn bản'. BẮT BUỘC TRẢ LỜI BẰNG TIẾNG VIỆT.\n\n- Chức năng: Hãy mô tả chính xác chức năng của lệnh/vị trí ĐÓ (ví dụ: lệnh này dùng để làm gì, nhân vật sẽ phản ứng ra sao).\n- Ví dụ thực tế: Hãy cho một ví dụ gắn liền với chức năng đó (ví dụ lệnh rẽ trái thì như đi đường gặp ngã tư rẽ trái, lệnh di chuyển thì như bước đi)." }
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
      resultJson = JSON.parse(response.text || '{}');
    } catch (genErr) {
      console.warn("Fallback response used for identify-object due to API overload:", genErr);
      resultJson = {
        name: "Lệnh / Linh Kiện Được Chọn",
        function: "Đây là phần vị trí hoặc lệnh điều khiển được chọn trên sơ đồ. Dùng để thiết lập thuộc tính và kích hoạt quy trình mô phỏng.",
        real_life_example: "Tương tự như công tắc kích hoạt thiết bị hoặc bảng hướng dẫn trong đời sống thực tế."
      };
    }

    res.json({ result: resultJson });
  } catch (error: any) {
    console.error("Error in /api/identify-object:", error);
    res.json({
      result: {
        name: "Chi Tiết Vị Trí",
        function: "Linh kiện / Vị trí này đóng vai trò quan trọng trong sơ đồ bài học.",
        real_life_example: "Ví dụ thực tế tương tự trong cuộc sống hàng ngày."
      }
    });
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
    const { imageBase64, prompt, description } = req.body;
    const promptText = prompt || description || "Mô phỏng hành động";

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
      { text: `Bạn là một AI phân tích hình ảnh và tạo kịch bản mô phỏng thuật toán hoặc các bước xử lý bài toán một cách chi tiết.

Nhiệm vụ: Phân tích bài toán, sơ đồ, hoặc khối lệnh (Ví dụ: Scratch) có trong hình ảnh.
Dựa vào yêu cầu của người dùng: "${promptText}".
Hãy mô tả chi tiết thuật toán hoặc các bước để xử lý/giải quyết bài toán đó.

Quy tắc BẮT BUỘC:
1. Bạn BẮT BUỘC phải tạo các bước thuật toán ĐÚNG CHÍNH XÁC theo mô tả và hình ảnh. KHÔNG ĐƯỢC tạo kịch bản chung chung.
2. Viết bằng Tiếng Việt rõ ràng, dễ hiểu.
3. Chia thuật toán thành các bước (tối thiểu 2 bước, tối đa 10 bước).
4. Không cần nhận diện object để di chuyển (trả về danh sách objects rỗng). Mỗi bước chỉ cần trường 'message' giải thích chi tiết bước đó.`
      }
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
      resultJson = JSON.parse(response.text || '{}');
    } catch (genErr) {
      console.warn("Fallback response used for simulate due to API overload:", genErr);
      resultJson = generateSmartFallback(promptText);
    }

    res.json({ result: resultJson });
  } catch (error: any) {
    console.error("Error in /api/simulate:", error);
    const fallback = generateSmartFallback(req.body?.prompt || req.body?.description || "Mô phỏng");
    res.json({ result: fallback });
  }
});

function generateSmartFallback(promptText: string) {
  const text = promptText.toLowerCase();

  let subjId = "ban_phim";
  let subjName = "Bàn phím";
  let subjBox = [380, 80, 560, 380];

  let targetId = "man_hinh";
  let targetName = "Màn hình";
  let targetBox = [200, 480, 550, 780];

  if (text.includes("chuột") || text.includes("chuot")) {
    subjId = "chuot";
    subjName = "Chuột";
    subjBox = [380, 400, 560, 470];
  } else if (text.includes("thân máy") || text.includes("than may") || text.includes("case")) {
    subjId = "than_may";
    subjName = "Thân máy";
    subjBox = [200, 800, 550, 950];
  } else if (text.includes("rô-bốt") || text.includes("robot")) {
    subjId = "robot";
    subjName = "Rô-bốt";
    subjBox = [300, 100, 600, 300];
  } else if (text.includes("linh kiện") || text.includes("khoi")) {
    subjId = "linh_kien";
    subjName = "Linh kiện";
    subjBox = [350, 100, 550, 350];
  }

  if (text.includes("màn hình") || text.includes("man hinh")) {
    targetId = "man_hinh";
    targetName = "Màn hình";
    targetBox = [200, 480, 550, 780];
  } else if (text.includes("thân máy") || text.includes("than may")) {
    targetId = "than_may";
    targetName = "Thân máy";
    targetBox = [200, 800, 550, 950];
  }

  return {
    objects: [
      { id: subjId, name: subjName, box_2d: subjBox },
      { id: targetId, name: targetName, box_2d: targetBox }
    ],
    animation_steps: [
      {
        message: `Bước 1: ${subjName} di chuyển hướng về phía ${targetName.toLowerCase()} theo kịch bản: "${promptText}".`,
        moves: [
          {
            objectId: subjId,
            target_box_2d: [targetBox[0], targetBox[1] - 30, targetBox[2], targetBox[3] - 30],
            transform: "translate(35%, -15%) scale(1)",
            transformOrigin: "center"
          }
        ]
      },
      {
        message: `Bước 2: ${subjName} kết nối thành công với ${targetName.toLowerCase()}.`,
        moves: [
          {
            objectId: subjId,
            target_box_2d: targetBox,
            transform: "translate(50%, -20%) scale(0.9)",
            transformOrigin: "center"
          }
        ]
      }
    ]
  };
}

export default app;
