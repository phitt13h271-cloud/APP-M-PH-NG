import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Image as ImageIcon, Sparkles, Loader2, Info, RotateCcw, Pause, MonitorPlay, FastForward, Settings, X, Volume2, Bot, FileText } from 'lucide-react';

interface AnimObj {
  id: string;
  name: string;
  box_2d: [number, number, number, number];
}
interface AnimStep {
  message: string;
  moves: { 
    objectId: string; 
    target_box_2d: [number, number, number, number];
    transform?: string;
    transformOrigin?: string;
  }[];
}

interface SimulationData {
  objects: AnimObj[];
  animation_steps: AnimStep[];
}

export default function InteractiveSimulationApp() {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);
  const imageSrc = currentImageIndex >= 0 ? images[currentImageIndex] : null;

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationData | null>(null);
  const [objectInfo, setObjectInfo] = useState<{name: string, function: string, real_life_example?: string} | null>(null);

  const [extractedObjects, setExtractedObjects] = useState<AnimObj[]>([]);
  const [scriptCommands, setScriptCommands] = useState<{id: string, objectId: string, action: string, value: string}[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>('move');
  const [selectedValue, setSelectedValue] = useState<string>("10");
  const [simulationPrompt, setSimulationPrompt] = useState<string>("");

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");

  useEffect(() => {
      const storedKey = localStorage.getItem("gemini_api_key");
      if (storedKey) setApiKeyInput(storedKey);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
      if (imageSrc) {
          extractObjects(imageSrc);
      } else {
          setExtractedObjects([]);
          setScriptCommands([]);
          setSelectedObjectId("");
      }
  }, [imageSrc]);

  const extractObjects = async (imgBase64: string) => {
      setLoadingAction('extract');
      try {
          const apiKey = localStorage.getItem("gemini_api_key") || "";
          const response = await fetch('/api/extract-objects', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-api-key': apiKey
              },
              body: JSON.stringify({ imageBase64: imgBase64 })
          });
          
          if (!response.ok) {
              if (response.status === 429) {
                  setObjectInfo({ name: "Hệ thống bận", function: "Thầy/Cô ơi, API đang bận hoặc hết lượt dùng. Xin vui lòng cài đặt API Key trong Cài đặt!" });
                  speak("API đang bận hoặc hết lượt dùng. Xin vui lòng cài đặt API Key.");
              }
              setExtractedObjects([]);
              return;
          }

          const data = await response.json();
          if (data.result && data.result.objects) {
              setExtractedObjects(data.result.objects);
              if (data.result.objects.length > 0) {
                  setSelectedObjectId(data.result.objects[0].id);
              }
          }
      } catch (err) {
          console.error("Error extracting objects", err);
      } finally {
          setLoadingAction(null);
      }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files) as File[];
    
    try {
        const base64Images = await Promise.all(fileArray.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const MAX_SIZE = 1024;
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            resolve(event.target?.result as string);
                            return;
                        }
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve(canvas.toDataURL('image/jpeg', 0.8));
                    };
                    img.onerror = reject;
                    img.src = event.target?.result as string;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }));

        setImages(prev => {
            const updated = [...prev, ...base64Images];
            setCurrentImageIndex(updated.length - 1);
            return updated;
        });
        setSimulationResult(null);
        setObjectInfo(null);
        setCurrentStepIndex(-1);
        setIsPlaying(false);
    } catch (err) {
        console.error("Error reading files", err);
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
      setImages(prev => {
          const updated = prev.filter((_, i) => i !== indexToDelete);
          if (updated.length === 0) {
              setCurrentImageIndex(-1);
              setSimulationResult(null);
              setObjectInfo(null);
              setCurrentStepIndex(-1);
              setIsPlaying(false);
          } else if (currentImageIndex === indexToDelete) {
              setCurrentImageIndex(0);
              setSimulationResult(null);
              setObjectInfo(null);
              setCurrentStepIndex(-1);
              setIsPlaying(false);
          } else if (currentImageIndex > indexToDelete) {
              setCurrentImageIndex(currentImageIndex - 1);
          }
          return updated;
      });
  };

  const selectImage = (index: number) => {
      setCurrentImageIndex(index);
      setSimulationResult(null);
      setObjectInfo(null);
      setCurrentStepIndex(-1);
      setIsPlaying(false);
  };

  useEffect(() => {
      // Preload voices
      if ('speechSynthesis' in window) {
          window.speechSynthesis.getVoices();
          window.speechSynthesis.onvoiceschanged = () => {
              window.speechSynthesis.getVoices();
          };
      }
  }, []);

  useEffect(() => {
      let isActive = true;
      if (isPlaying && simulationResult) {
          if (currentStepIndex >= simulationResult.animation_steps.length) {
              setIsPlaying(false);
              return;
          }
          
          if (currentStepIndex === -1) {
              const timeout = setTimeout(() => {
                  if (isActive) setCurrentStepIndex(i => i + 1);
              }, 1000);
              return () => {
                  isActive = false;
                  clearTimeout(timeout);
              };
          } else if (currentStepIndex >= 0) {
              speak(simulationResult.animation_steps[currentStepIndex].message, () => {
                  if (isActive) {
                      setTimeout(() => {
                          if (isActive) setCurrentStepIndex(i => i + 1);
                      }, 500);
                  }
              });
              return () => {
                  isActive = false;
                  stopSpeaking();
              };
          }
      }
      return () => { isActive = false; };
  }, [isPlaying, currentStepIndex, simulationResult]);

  const getObjectStyle = (objId: string) => {
      let tx = 0, ty = 0, scale = 1, zIndex = 10, originX = 50, originY = 50;
      let rawTransform: string | null = null;
      let rawTransformOrigin: string | null = null;
      
      if (simulationResult && currentStepIndex >= 0) {
          let latestTargetBox: [number, number, number, number] | null = null;
          
          for (let i = 0; i <= currentStepIndex; i++) {
             const step = simulationResult.animation_steps[i];
             const move = step?.moves?.find((m: any) => m.objectId === objId);
             if (move) {
                 if (move.target_box_2d) {
                     latestTargetBox = move.target_box_2d;
                 }
                 if (move.transform) {
                     rawTransform = move.transform;
                 }
                 if (move.transformOrigin) {
                     rawTransformOrigin = move.transformOrigin;
                 }
             }
          }
          
          if (latestTargetBox) {
              const obj = simulationResult.objects.find(o => o.id === objId);
              if (obj) {
                  // Vị trí tâm gốc của vật thể (theo %)
                  const cx = (obj.box_2d[1] + obj.box_2d[3]) / 2 / 10;
                  const cy = (obj.box_2d[0] + obj.box_2d[2]) / 2 / 10;
                  
                  originX = cx;
                  originY = cy;

                  // Vị trí tâm đích đến (theo %)
                  const tgtX = (latestTargetBox[1] + latestTargetBox[3]) / 2 / 10;
                  const tgtY = (latestTargetBox[0] + latestTargetBox[2]) / 2 / 10;
                  
                  tx = tgtX - cx;
                  ty = tgtY - cy;
                  
                  // Tính toán scale nếu kích thước box đích nhỏ hoặc lớn hơn
                  const origW = obj.box_2d[3] - obj.box_2d[1];
                  const tgtW = latestTargetBox[3] - latestTargetBox[1];
                  if (origW > 0 && tgtW > 0) {
                      scale = Math.min(1.0, tgtW / origW);
                  } else {
                      scale = 1.0;
                  }
                  zIndex = 20;
                  return {
                      transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
                      transformOrigin: `${originX}% ${originY}%`,
                      zIndex
                  };
              }
          }

          if (rawTransform) {
              return {
                  transform: rawTransform,
                  transformOrigin: rawTransformOrigin || 'center',
                  zIndex: 20
              };
          }
      }
      
      return { 
          transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
          transformOrigin: `${originX}% ${originY}%`,
          zIndex 
      };
  }

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const getObjectSpeechText = (info: { name: string; function: string; real_life_example?: string } | null) => {
    if (!info) return '';
    const parts: string[] = [];
    if (info.name) {
      parts.push(info.name);
    }
    if (info.function) {
      const fnText = info.function.toLowerCase().startsWith('chức năng')
        ? info.function
        : `Chức năng: ${info.function}`;
      parts.push(fnText);
    }
    if (info.real_life_example) {
      const exText = info.real_life_example.toLowerCase().startsWith('ví dụ')
        ? info.real_life_example
        : `Ví dụ thực tế: ${info.real_life_example}`;
      parts.push(exText);
    }
    return parts.join('. ');
  };

  const speak = (text: string, onEnd?: () => void) => {
    stopSpeaking();

    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return;
    }

    let finished = false;
    const triggerEnd = () => {
      if (!finished) {
        finished = true;
        if (onEnd) onEnd();
      }
    };

    // Prepare clean text
    const cleanText = text.replace(/[\n\r]+/g, " ").trim();

    // Split text into chunks <= 150 chars for Google Translate TTS API
    const sentences = cleanText.match(/[^.!?\n]+[.!?\n]?/g) || [cleanText];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= 150) {
        currentChunk += sentence;
      } else {
        if (currentChunk.trim()) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    // Primary method: High-quality Google TTS MP3 audio (100% natural Vietnamese voice)
    if (chunks.length > 0) {
      let index = 0;
      const playNextChunk = () => {
        if (index >= chunks.length) {
          audioRef.current = null;
          triggerEnd();
          return;
        }

        const chunkText = chunks[index];
        index++;

        const ttsUrl = `/api/tts?text=${encodeURIComponent(chunkText)}`;
        const audio = new Audio(ttsUrl);
        audioRef.current = audio;

        audio.onended = () => {
          playNextChunk();
        };

        audio.onerror = () => {
          // If audio player fails, try Web Speech API ONLY IF Vietnamese voice exists
          fallbackWebSpeech(cleanText);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            fallbackWebSpeech(cleanText);
          });
        }
      };

      playNextChunk();
      return;
    }

    function fallbackWebSpeech(phrase: string) {
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.lang = 'vi-VN';
          utterance.rate = 0.95;

          const voices = window.speechSynthesis.getVoices();
          const viVoice = voices.find(v => 
            v.lang === 'vi-VN' || 
            v.lang === 'vi_VN' ||
            v.lang.toLowerCase().startsWith('vi') || 
            v.name.toLowerCase().includes('vietnamese') ||
            v.name.toLowerCase().includes('tiếng việt')
          );

          if (viVoice) {
            utterance.voice = viVoice;
            utterance.onend = triggerEnd;
            utterance.onerror = triggerEnd;
            window.speechSynthesis.speak(utterance);
            return;
          }
        } catch (e) {
          // Ignore
        }
      }
      triggerEnd();
    }
  };

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageSrc || loadingAction || simulationResult) return;
    
    // Unlock speech engine
    speak("Đang phân tích...");
    
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if(!img) return;

    const rect = canvas.getBoundingClientRect();

    const containerRatio = rect.width / rect.height;
    const imageRatio = img.naturalWidth / img.naturalHeight;

    let renderWidth, renderHeight, offsetX = 0, offsetY = 0;
    if (imageRatio > containerRatio) {
        renderWidth = rect.width;
        renderHeight = rect.width / imageRatio;
        offsetY = (rect.height - renderHeight) / 2;
    } else {
        renderHeight = rect.height;
        renderWidth = rect.height * imageRatio;
        offsetX = (rect.width - renderWidth) / 2;
    }

    const clickX = e.clientX - rect.left - offsetX;
    const clickY = e.clientY - rect.top - offsetY;

    if (clickX < 0 || clickX > renderWidth || clickY < 0 || clickY > renderHeight) return;

    const x = clickX * (img.naturalWidth / renderWidth);
    const y = clickY * (img.naturalHeight / renderHeight);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image temporarily for the API
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const drawTarget = () => {
      // Draw red arrow pointing to the clicked point
      const arrowLen = Math.max(canvas.width / 12, 40);
      ctx.beginPath();
      ctx.moveTo(x + arrowLen, y - arrowLen);
      ctx.lineTo(x, y);
      ctx.lineTo(x + arrowLen/2, y - arrowLen);
      ctx.moveTo(x, y);
      ctx.lineTo(x + arrowLen, y - arrowLen/2);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = Math.max(canvas.width / 120, 5);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    };
    
    drawTarget();
    const markedImageBase64 = canvas.toDataURL('image/jpeg', 0.8);

    // Clear canvas and redraw ONLY the target so it acts as a transparent overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTarget();

    setLoadingAction('identify');
    try {
        const apiKey = localStorage.getItem("gemini_api_key") || "";
        const response = await fetch('/api/identify-object', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-api-key': apiKey 
            },
            body: JSON.stringify({ imageBase64: markedImageBase64 })
        });
        
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            if (response.status === 503 || response.status === 429) {
                setObjectInfo({ name: "Hệ thống bận", function: "Thầy/Cô ơi, API đang bận hoặc hết lượt dùng. Xin chờ một lúc rồi thử lại ạ!" });
            } else {
                setObjectInfo({ name: "Lỗi kết nối", function: "Đã xảy ra lỗi mạng. Vui lòng kiểm tra lại." });
            }
            return;
        }

        if (data.result) {
            setObjectInfo(data.result);
            const sayText = getObjectSpeechText(data.result);
            speak(sayText);
        } else {
            // Silently handle error to avoid AI Studio overlay
            setObjectInfo({ name: "Thông báo", function: data.error || "Không thể nhận diện đối tượng." });
        }
    } catch (e) {
        // Silently handle
    } finally {
        setLoadingAction(null);
    }
  };

  const handleSimulate = () => {
    if (loadingAction || extractedObjects.length === 0) return;

    let targetImage = imageSrc;
    if (!targetImage && images.length > 0) {
        targetImage = images[0];
        setCurrentImageIndex(0);
    }

    if (!targetImage) {
        setObjectInfo({ name: "Thông báo", function: "Vui lòng tải lên một hình ảnh trước." });
        speak("Vui lòng tải lên một hình ảnh trước.");
        return;
    }

    speak("Đang tạo mô phỏng...");
    setLoadingAction('simulate');
    
    // Simulate generation locally
    setTimeout(() => {
        let currentTransforms: Record<string, { tx: number, ty: number, rot: number }> = {};
        extractedObjects.forEach(obj => {
            currentTransforms[obj.id] = { tx: 0, ty: 0, rot: 0 };
        });

        const steps: AnimStep[] = [];
        
        scriptCommands.forEach((cmd, i) => {
            const obj = currentTransforms[cmd.objectId];
            const originalObj = extractedObjects.find(o => o.id === cmd.objectId);
            if (!obj || !originalObj) return;
            
            if (cmd.action === 'move') {
               const dist = parseInt(cmd.value) || 0;
               // Di chuyển theo hướng hiện tại
               const rad = obj.rot * Math.PI / 180;
               obj.tx += (dist * 2) * Math.cos(rad); // x2 to make step more visible
               obj.ty += (dist * 2) * Math.sin(rad);
            } else if (cmd.action === 'turn_right') {
               const angle = parseInt(cmd.value) || 0;
               obj.rot += angle;
            } else if (cmd.action === 'turn_left') {
               const angle = parseInt(cmd.value) || 0;
               obj.rot -= angle;
            } else if (cmd.action === 'random') {
               obj.tx = (Math.random() * 200) - 100;
               obj.ty = (Math.random() * 200) - 100;
            }

            const objName = originalObj.name || cmd.objectId;
            let actionText = "";
            if (cmd.action === 'move') actionText = `di chuyển ${cmd.value} bước`;
            else if (cmd.action === 'turn_right') actionText = `xoay phải ${cmd.value} độ`;
            else if (cmd.action === 'turn_left') actionText = `xoay trái ${cmd.value} độ`;
            else if (cmd.action === 'random') actionText = `di chuyển đến vị trí ngẫu nhiên`;

            const cx = (originalObj.box_2d[1] + originalObj.box_2d[3]) / 2 / 10;
            const cy = (originalObj.box_2d[0] + originalObj.box_2d[2]) / 2 / 10;

            steps.push({
                message: `Bước ${i + 1}: ${objName} ${actionText}.`,
                moves: [
                    {
                        objectId: cmd.objectId,
                        transform: `translate(${obj.tx}px, ${obj.ty}px) rotate(${obj.rot}deg)`,
                        transformOrigin: `${cx}% ${cy}%`,
                        target_box_2d: null as any
                    }
                ]
            });
        });

        if (steps.length === 0) {
            setSimulationResult(null);
            setObjectInfo({ name: "Thông báo", function: "Vui lòng thêm ít nhất một lệnh vào kịch bản." });
            speak("Vui lòng thêm ít nhất một lệnh vào kịch bản.");
        } else {
            setSimulationResult({
                objects: extractedObjects,
                animation_steps: steps
            });
            setCurrentStepIndex(-1);
            setIsPlaying(true);
            speak("Tạo mô phỏng thành công! Đang phát mô phỏng.");
        }
        
        setLoadingAction(null);
    }, 1000);
  };

  const handleSimulateAI = async () => {
    if (loadingAction || !simulationPrompt.trim()) return;

    let targetImage = imageSrc;
    if (!targetImage && images.length > 0) {
        targetImage = images[0];
        setCurrentImageIndex(0);
    }

    if (!targetImage) {
        setObjectInfo({ name: "Thông báo", function: "Vui lòng tải lên một hình ảnh trước." });
        speak("Vui lòng tải lên một hình ảnh trước.");
        return;
    }

    speak("Đang tạo mô phỏng từ AI...");
    setLoadingAction('simulate');
    
    try {
        const apiKey = localStorage.getItem("gemini_api_key") || "";
        const response = await fetch('/api/simulate', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-api-key': apiKey 
            },
            body: JSON.stringify({ 
                imageBase64: targetImage,
                prompt: simulationPrompt,
                existingObjects: extractedObjects
            })
        });
        
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            setObjectInfo({ name: "Lỗi", function: "Phản hồi từ máy chủ không hợp lệ." });
            setLoadingAction(null);
            return;
        }

        if (!response.ok) {
            setObjectInfo({ name: "Thông báo", function: data.error || "Không thể tạo mô phỏng." });
            speak("Không thể tạo mô phỏng, vui lòng thử lại.");
        } else if (data.result) {
            // Keep original extracted objects if AI returns none, but use AI's animation steps
            const objectsToUse = (data.result.objects && data.result.objects.length > 0) ? data.result.objects : extractedObjects;
            
            setSimulationResult({
                objects: objectsToUse,
                animation_steps: data.result.animation_steps || []
            });
            setCurrentStepIndex(-1);
            setIsPlaying(true);
            speak("Tạo mô phỏng AI thành công!");
        }
    } catch (err) {
        console.error(err);
        setObjectInfo({ name: "Thông báo", function: "Lỗi kết nối tới máy chủ." });
        speak("Đã xảy ra lỗi kết nối.");
    } finally {
        setLoadingAction(null);
    }
  };

  const togglePlay = () => {
      if (!simulationResult) return;
      if (currentStepIndex >= simulationResult.animation_steps.length) {
          setCurrentStepIndex(-1);
          setIsPlaying(true);
      } else {
          setIsPlaying(!isPlaying);
      }
  }

  return (
    <div 
      className="min-h-screen text-slate-200 p-4 lg:p-6 font-sans flex flex-col items-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-[#0B1021]/85 backdrop-blur-[2px] z-0 pointer-events-none"></div>
      <div className="w-full max-w-6xl space-y-6 z-10 relative">
        
        <header className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#5B5CE5] rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot size={24} className="text-white" />
                </div>
                <div>
                   <h1 className="text-xl font-bold text-white tracking-wide">APP MÔ PHỎNG TRỰC QUAN</h1>
                   <p className="text-sm text-slate-400 font-medium mt-0.5">Ứng dụng được phát triển bởi thầy giáo Lê Văn Phi</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center p-2.5 rounded-xl bg-[#131C31]/80 backdrop-blur-md hover:bg-[#1E293B] border border-[#1E293B] transition-colors"
                >
                  <Settings size={20} className="text-slate-400" />
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT PANEL (lg:col-span-3): Object Recognition (Nhận Diện Đối Tượng) */}
            <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
                <div className="bg-[#131C31]/80 backdrop-blur-md p-5 rounded-3xl border border-[#1E293B] shadow-xl flex flex-col min-h-[480px]">
                    <div className="flex items-center gap-2.5 mb-4">
                        <Info size={20} className="text-[#5B5CE5]" />
                        <h3 className="text-lg font-bold text-white tracking-wide">Nhận Diện Đối Tượng</h3>
                    </div>

                    {/* Extracted Objects Quick Selection List (Removed) */}
                    
                    {objectInfo ? (
                        <div className="bg-[#0B1021]/70 backdrop-blur-sm p-4 rounded-2xl border border-[#1E293B] animate-in fade-in zoom-in-95 flex-1 flex flex-col gap-3 relative group shadow-inner">
                            <div>
                                <h4 className="text-lg font-bold text-[#5B5CE5] mb-1 pr-8">{objectInfo.name}</h4>
                                <button 
                                    onClick={() => speak(getObjectSpeechText(objectInfo))}
                                    className="absolute top-4 right-4 p-2 bg-[#131C31]/80 backdrop-blur-md hover:bg-[#1E293B] rounded-full text-white transition-colors cursor-pointer border border-[#1E293B] shadow"
                                    title="Nghe lại thông tin"
                                >
                                    <Volume2 size={16} />
                                </button>
                                <div className="h-px w-full bg-[#1E293B] my-2" />
                            </div>
                            <div className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                                <span className="font-bold text-[#5B5CE5] block mb-1">Chức năng:</span>
                                {objectInfo.function}
                            </div>
                            {objectInfo.real_life_example && (
                                <div className="mt-auto bg-[#131C31]/80 backdrop-blur-md border border-[#1E293B] p-3 rounded-xl text-xs sm:text-sm">
                                    <span className="font-bold text-amber-400 block mb-1">Ví dụ thực tế:</span>
                                    <p className="text-slate-200 leading-relaxed">{objectInfo.real_life_example}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#0B1021]/70 backdrop-blur-sm rounded-2xl border border-[#1E293B] border-dashed text-slate-400 p-5 text-center">
                            <ImageIcon size={32} className="mb-2 opacity-40 text-[#5B5CE5]" />
                            <p className="text-sm font-medium text-slate-200">Chưa chọn đối tượng</p>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Nhấp trực tiếp vào bất kỳ đối tượng nào trên hình ảnh hoặc chọn từ danh sách trên.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CENTER PANEL (lg:col-span-6): Image Display & Simulation Player Screen */}
            <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
                <div className="bg-[#131C31]/80 backdrop-blur-md rounded-3xl border border-[#1E293B] shadow-2xl relative flex flex-col overflow-hidden min-h-[480px]">
                
                {/* Title overlay */}
                <div className="absolute top-3 left-0 right-0 z-40 flex justify-center pointer-events-none px-4">
                    {loadingAction === 'identify' && (
                        <div className="flex items-center gap-2 text-yellow-400 font-medium bg-black/70 px-4 py-1.5 rounded-full backdrop-blur-md border border-yellow-500/30 shadow-lg">
                           <Loader2 size={16} className="animate-spin" /> Đang nhận diện vị trí...
                        </div>
                    )}
                </div>

                {/* Player Screen */}
                <div className="flex-1 relative w-full flex items-center justify-center bg-[#0B1021]/50 overflow-hidden min-h-[400px]">
                    {!imageSrc ? (
                        <div className="flex flex-col items-center justify-center w-full h-full p-6">
                            <div className="text-center text-slate-500 flex flex-col items-center max-w-md">
                                <ImageIcon size={56} className="mb-3 opacity-30 text-[#5B5CE5]" />
                                <p className="font-bold text-base text-slate-200">Chưa có hình ảnh mô phỏng</p>
                                <p className="text-xs mt-1 text-slate-400">Vui lòng tải ảnh sơ đồ hoặc bài học lên để bắt đầu.</p>
                                <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pointer-events-auto">
                                    <label className="px-5 py-2 rounded-full bg-[#5B5CE5] hover:bg-[#4d4ee0] text-white text-xs font-bold cursor-pointer transition-all shadow-lg">
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                                            handleImageUpload(e);
                                            e.target.value = '';
                                        }} />
                                        Tải Ảnh Lên
                                    </label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative flex max-w-full max-h-full items-center justify-center">
                            {/* Static background image - background stays intact during movement */}
                            <img 
                                ref={imageRef} 
                                src={imageSrc} 
                                className="block max-w-full max-h-full object-contain" 
                                crossOrigin="anonymous"
                            />
                            
                            {/* Hitbox canvas for click identification */}
                            {!simulationResult && (
                                <canvas 
                                    ref={canvasRef} 
                                    onClick={handleCanvasClick}
                                    className="absolute inset-0 w-full h-full object-contain cursor-crosshair z-10"
                                />
                            )}

                            {/* Simulation Layers - Only the character moves, background stays static */}
                            {simulationResult && (
                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    {/* Moving objects layer */}
                                    {simulationResult.objects.map(obj => {
                                        const isObjectInScript = scriptCommands.some(cmd => cmd.objectId === obj.id);
                                        if (!isObjectInScript) return null;

                                        const xmin = obj.box_2d[1] / 10;
                                        const ymin = obj.box_2d[0] / 10;
                                        const xmax = obj.box_2d[3] / 10;
                                        const ymax = obj.box_2d[2] / 10;
                                        const clipPath = `polygon(${xmin}% ${ymin}%, ${xmax}% ${ymin}%, ${xmax}% ${ymax}%, ${xmin}% ${ymax}%)`;
                                        
                                        const style = getObjectStyle(obj.id);
                                        const isMoving = currentStepIndex >= 0;

                                        return (
                                            <div key={obj.id} 
                                                 className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
                                                 style={{ 
                                                  transform: style.transform, 
                                                  transformOrigin: style.transformOrigin, 
                                                  zIndex: style.zIndex
                                                 }}
                                            >
                                                 <div className="absolute inset-0"
                                                      style={{
                                                          backgroundImage: `url(${imageSrc})`,
                                                          backgroundSize: '100% 100%',
                                                          clipPath: clipPath,
                                                          filter: isMoving ? 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))' : 'none',
                                                      }}
                                                 />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Video Controls Bar */}
                {simulationResult && (
                    <div className="bg-[#131C31]/80 backdrop-blur-md border-t border-[#1E293B] p-3 z-40 shrink-0 flex flex-col gap-2.5">
                        <div className="text-white text-center font-medium text-xs sm:text-sm min-h-[36px] flex items-center justify-center px-3 bg-[#0B1021]/70 backdrop-blur-sm rounded-xl border border-[#1E293B]">
                          {currentStepIndex >= 0 && currentStepIndex < simulationResult.animation_steps.length 
                            ? <span className="animate-in fade-in slide-in-from-bottom-2">"{simulationResult.animation_steps[currentStepIndex].message}"</span>
                            : <span className="text-slate-400 italic">Hoạt ảnh đã hoàn tất</span>}
                        </div>
                        
                        <div className="flex items-center gap-3 px-1">
                           <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-[#5B5CE5] hover:bg-[#4d4ee0] text-white flex items-center justify-center shadow-[0_0_15px_rgba(91,92,229,0.4)] transition-all active:scale-95 shrink-0">
                              {isPlaying ? <Pause fill="currentColor" size={16} /> 
                                         : (currentStepIndex >= simulationResult.animation_steps.length ? <RotateCcw size={16} /> : <Play fill="currentColor" size={16} className="translate-x-0.5" />)}
                           </button>
                           
                           <div className="flex-1 h-2.5 bg-[#0B1021]/70 backdrop-blur-sm rounded-full relative overflow-hidden shadow-inner cursor-pointer" onClick={(e) => {
                               const rect = e.currentTarget.getBoundingClientRect();
                               const flex = (e.clientX - rect.left) / rect.width;
                               const step = Math.floor(flex * simulationResult!.animation_steps.length);
                               setCurrentStepIndex(Math.max(-1, Math.min(step, simulationResult!.animation_steps.length - 1)));
                           }}>
                              <div className="absolute top-0 left-0 h-full bg-[#5B5CE5] rounded-full transition-all duration-300" 
                                   style={{ width: `${Math.max(0, currentStepIndex + 1) / Math.max(1, simulationResult.animation_steps.length) * 100}%` }} 
                              />
                           </div>
                           
                           <span className="text-slate-400 text-xs font-bold font-mono shrink-0">
                                {Math.max(0, currentStepIndex + 1)} / {simulationResult.animation_steps.length}
                           </span>
                        </div>
                    </div>
                )}
                
                </div>
                
                {/* Image Gallery */}
                {images.length > 0 && (
                    <div className="p-3 bg-[#131C31]/80 backdrop-blur-md rounded-2xl border border-[#1E293B] flex gap-2.5 overflow-x-auto custom-scrollbar shadow-xl pointer-events-auto items-center">
                        {images.map((src, idx) => (
                            <div key={idx} className={`relative group w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${idx === currentImageIndex ? 'border-[#5B5CE5]' : 'border-[#1E293B] hover:border-[#334155]'}`} onClick={() => selectImage(idx)}>
                                <img src={src} className="w-full h-full object-cover" />
                                <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow" onClick={(e) => { e.stopPropagation(); handleDeleteImage(idx); }}>
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <label className="w-16 h-16 rounded-lg border-2 border-dashed border-[#1E293B] hover:border-[#5B5CE5] flex items-center justify-center cursor-pointer shrink-0 transition-colors group">
                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                                handleImageUpload(e);
                                e.target.value = '';
                            }} />
                            <Upload size={20} className="text-slate-500 group-hover:text-[#5B5CE5] transition-colors" />
                        </label>
                    </div>
                )}
            </div>

            {/* RIGHT PANEL (lg:col-span-3): Simulation Scripting & Controls (Chức Năng Mô Phỏng) */}
            <div className="lg:col-span-3 flex flex-col gap-6 order-3">
                <div className="bg-[#131C31]/80 backdrop-blur-md p-5 rounded-3xl border border-[#1E293B] shadow-xl flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 mb-1">
                        <Sparkles size={20} className="text-[#5B5CE5]" />
                        <h3 className="text-lg font-bold text-white tracking-wide">Kịch Bản Mô Phỏng</h3>
                    </div>

                    {loadingAction === 'extract' ? (
                        <div className="flex items-center gap-2 text-slate-400 text-xs py-4">
                            <Loader2 size={16} className="animate-spin text-[#5B5CE5]" />
                            <span>Đang nhận diện nhân vật...</span>
                        </div>
                    ) : extractedObjects.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-3 bg-[#0B1021]/70 backdrop-blur-sm border border-[#1E293B] rounded-2xl p-3.5">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1.5 block font-medium">1. Chọn nhân vật:</label>
                                    <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                                        {extractedObjects.map(obj => (
                                            <button 
                                                key={obj.id} 
                                                onClick={() => setSelectedObjectId(obj.id)} 
                                                className={`shrink-0 px-3 py-2.5 rounded-lg border text-left text-xs truncate transition-all ${selectedObjectId === obj.id ? 'border-[#5B5CE5] bg-[#5B5CE5]/20 text-[#5B5CE5] font-bold' : 'border-[#1E293B] bg-[#131C31]/80 backdrop-blur-md text-slate-300 hover:border-[#334155]'}`}
                                            >
                                                {obj.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1.5 block font-medium">2. Chọn hành động:</label>
                                        <select 
                                            value={selectedAction} 
                                            onChange={(e) => {
                                                setSelectedAction(e.target.value);
                                                if (e.target.value === 'move') setSelectedValue("10");
                                                else if (e.target.value === 'turn_right' || e.target.value === 'turn_left') setSelectedValue("30");
                                            }}
                                            className="w-full bg-[#131C31]/80 backdrop-blur-md border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5B5CE5]"
                                        >
                                            <option value="move">Di chuyển</option>
                                            <option value="turn_right">Xoay phải</option>
                                            <option value="turn_left">Xoay trái</option>
                                            <option value="random">Vị trí ngẫu nhiên</option>
                                        </select>
                                    </div>
                                    
                                    {selectedAction !== 'random' && (
                                        <div>
                                            <label className="text-xs text-slate-400 mb-1.5 block font-medium">3. Giá trị ({selectedAction === 'move' ? 'Bước' : 'Độ'}):</label>
                                            <select 
                                                value={selectedValue} 
                                                onChange={(e) => setSelectedValue(e.target.value)}
                                                className="w-full bg-[#131C31]/80 backdrop-blur-md border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5B5CE5]"
                                            >
                                                {selectedAction === 'move' ? (
                                                    <>
                                                        <option value="10">10 Bước</option>
                                                        <option value="20">20 Bước</option>
                                                        <option value="30">30 Bước</option>
                                                        <option value="40">40 Bước</option>
                                                        <option value="50">50 Bước</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="30">30 Độ</option>
                                                        <option value="45">45 Độ</option>
                                                        <option value="60">60 Độ</option>
                                                        <option value="72">72 Độ</option>
                                                        <option value="90">90 Độ</option>
                                                        <option value="120">120 Độ</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        if (!selectedObjectId) return;
                                        setScriptCommands([...scriptCommands, { id: Math.random().toString(), objectId: selectedObjectId, action: selectedAction, value: selectedAction === 'random' ? '' : selectedValue }]);
                                    }}
                                    className="w-full bg-[#1E293B] hover:bg-[#334155] text-white py-2.5 rounded-xl transition-all font-medium text-xs border border-[#334155] mt-1"
                                >
                                    + Thêm vào kịch bản
                                </button>
                            </div>

                            {scriptCommands.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-xs text-slate-400 font-medium">Các lệnh đã thêm:</h4>
                                    <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                                        {scriptCommands.map((cmd, idx) => (
                                            <div key={cmd.id} className="flex items-center justify-between bg-[#0B1021]/70 backdrop-blur-sm border border-[#1E293B] rounded-xl p-2.5 text-xs shrink-0">
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <span className="w-5 h-5 rounded-full bg-[#5B5CE5]/20 text-[#5B5CE5] flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                                                    <span className="text-white font-medium truncate">
                                                        {extractedObjects.find(o => o.id === cmd.objectId)?.name || cmd.objectId} 
                                                        {' - '}
                                                        {cmd.action === 'move' ? `${cmd.value} bước` : 
                                                         cmd.action === 'turn_right' ? `Xoay +${cmd.value}°` : 
                                                         cmd.action === 'turn_left' ? `Xoay -${cmd.value}°` : 
                                                         'Ngẫu nhiên'}
                                                    </span>
                                                </div>
                                                <button onClick={() => setScriptCommands(scriptCommands.filter(c => c.id !== cmd.id))} className="text-red-400 hover:text-red-300 ml-1 shrink-0">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="text-xs text-slate-400 font-medium">Hoặc tạo tự động bằng AI (Nhập mô tả):</label>
                                <textarea
                                    className="w-full bg-[#0B1021]/70 backdrop-blur-sm border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5B5CE5] resize-none h-16"
                                    placeholder="Ví dụ: Mô phỏng hành động mèo di chuyển lại gần chuột..."
                                    value={simulationPrompt}
                                    onChange={(e) => setSimulationPrompt(e.target.value)}
                                />
                                <button 
                                    onClick={handleSimulateAI}
                                    disabled={loadingAction === 'simulate' || !simulationPrompt.trim()}
                                    className="w-full bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    {loadingAction === 'simulate' ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                    {loadingAction === 'simulate' ? 'Đang tạo...' : 'Tạo Mô Phỏng Bằng AI'}
                                </button>
                            </div>

                            <button 
                                onClick={handleSimulate}
                                disabled={loadingAction === 'simulate' || scriptCommands.length === 0}
                                className="w-full bg-[#5B5CE5] hover:bg-[#4d4ee0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-full shadow-[0_0_20px_rgba(91,92,229,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99] mt-2"
                            >
                                {loadingAction === 'simulate' ? <Loader2 className="animate-spin" size={18} /> : <FastForward size={18} className="group-hover:scale-110 transition-transform" />}
                                {loadingAction === 'simulate' ? 'Đang tạo mô phỏng...' : 'Tạo Mô Phỏng'}
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-6 bg-[#0B1021]/70 backdrop-blur-sm border border-[#1E293B] rounded-2xl p-4">
                            <p className="text-xs text-slate-400 leading-relaxed opacity-50">Khu vực tạo kịch bản mô phỏng</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
      
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131C31]/80 backdrop-blur-md border border-[#1E293B] rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-5 right-5 p-2 hover:bg-[#1E293B] rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-8">
              <Settings className="text-[#5B5CE5]" size={24} />
              <h2 className="text-2xl font-bold text-white tracking-wide">Cài đặt API</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Gemini API Key</label>
                <input 
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0B1021]/70 backdrop-blur-sm border border-[#1E293B] rounded-2xl px-5 py-4 text-sm text-slate-200 outline-none focus:border-[#5B5CE5] focus:ring-1 focus:ring-[#5B5CE5] transition-all font-mono shadow-inner"
                />
                <p className="text-xs text-slate-500 mt-3 font-medium">
                  Key của bạn được lưu an toàn trực tiếp trên trình duyệt (localStorage).
                </p>
              </div>
              
              <button 
                onClick={() => {
                  localStorage.setItem("gemini_api_key", apiKeyInput.trim());
                  setShowSettings(false);
                }}
                className="w-full bg-[#5B5CE5] hover:bg-[#4d4ee0] text-white font-bold py-4 rounded-full transition-colors shadow-lg mt-2"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

