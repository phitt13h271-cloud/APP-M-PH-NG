import React, { useState, useRef, useEffect } from 'react';
import { Send, Monitor, Mouse as MouseIcon, Keyboard as KeyboardIcon, HardDrive, Volume2, Gamepad2, FileText, Image as ImageIcon, Bot } from 'lucide-react';

interface Props {
  apiKey: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const HardwareSoftwareSim: React.FC<Props> = ({ apiKey }) => {
   const [messages, setMessages] = useState<Message[]>([
      { role: 'assistant', content: 'Chào em! Chào mừng em đến với phòng máy tính ảo. Trợ lý AI ở đây để hỗ trợ em. Em hãy thử chạm vào (click) hoặc kéo (drag) các bộ phận máy tính và biểu tượng phần mềm trên màn hình nhé. Hoặc hãy hỏi trợ lý bất kỳ điều gì!' }
   ]);
   const [chatInput, setChatInput] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);
   
   const [activeHardware, setActiveHardware] = useState<string | null>(null);
   const [activeSoftware, setActiveSoftware] = useState<string | null>(null);
   const [draggedItem, setDraggedItem] = useState<{id: string, type: 'hw'|'sw', name: string} | null>(null);
   
   const sendMessageToAI = async (text: string, contextNote?: string) => {
       if (!apiKey) {
           setMessages(p => [...p, { role: 'assistant', content: 'Vui lòng cài đặt API Key Gemini ở nút góc trên bên phải để Trợ lý AI có thể hoạt động nhé!' }]);
           return;
       }

       const userMsg = text || (contextNote ? `[Hành động: ${contextNote}]` : '');
       if (text) setMessages(p => [...p, { role: 'user', content: text }]);
       
       setIsGenerating(true);
       
       try {
           const prompt = `
             Môi trường: Học sinh tiểu học đang học môn Tin học, bài "Phần cứng và Phần mềm".
             Lịch sử chat gần đây: ${messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')}
             Học sinh vừa: ${userMsg}
             Hãy đóng vai Trợ lý ảo (như một giáo viên tin học vui tính, dùng từ ngữ ngộ nghĩnh, xưng "thầy/cô" và gọi "em").
             1. Khen ngợi nếu học sinh thao tác đúng (ví dụ phân loại đúng phần cứng, phần mềm).
             2. Đưa ra gợi ý sửa sai nếu thao tác sai.
             3. Hoặc đặt ra một thử thách nhẹ nhàng (VD: "Máy tính không có tiếng, em sẽ kiểm tra dây nối loa (phần cứng) hay biểu tượng âm lượng (phần mềm)?")
             Lưu ý: Không giải thích quá dài, chỉ khoảng 2-3 câu ngắn gọn.
           `;

           const res = await fetch('/api/gemini', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
                   'x-gemini-key': apiKey
               },
               body: JSON.stringify({ prompt })
           });

           const data = await res.json();
           if (data.error) throw new Error(data.error);
           setMessages(p => [...p, { role: 'assistant', content: data.text }]);
       } catch (e: any) {
           console.error(e);
           setMessages(p => [...p, { role: 'assistant', content: `Lỗi kết nối AI: ${e.message}` }]);
       } finally {
           setIsGenerating(false);
       }
   };

   const handleSendChat = () => {
       if (!chatInput.trim()) return;
       sendMessageToAI(chatInput);
       setChatInput('');
   };

   const handleInteraction = (item: {id: string, type: 'hw'|'sw', name: string}) => {
       if (item.type === 'hw') setActiveHardware(item.id);
       if (item.type === 'sw') setActiveSoftware(item.id);
       
       setTimeout(() => {
           setActiveHardware(null);
           setActiveSoftware(null);
       }, 2000);
       
       // Log action
       sendMessageToAI('', `Em vừa click vào ${item.name} (${item.type === 'hw' ? 'Phần cứng' : 'Phần mềm'})`);
   };

   const handleDrop = (binType: 'hw' | 'sw') => {
       if (!draggedItem) return;
       
       const isCorrect = draggedItem.type === binType;
       const binName = binType === 'hw' ? 'Phần cứng' : 'Phần mềm';
       sendMessageToAI('', `Em vừa kéo thả [${draggedItem.name}] vào thùng [${binName}]. Hành động này là ${isCorrect ? 'ĐÚNG' : 'SAI'}.`);
       setDraggedItem(null);
   };

   return (
       <div className="w-full h-full flex overflow-hidden">
           {/* Interactive Workspace */}
           <div className="flex-1 bg-slate-100 relative p-8 flex flex-col justify-between"
                onDragOver={e => e.preventDefault()}
           >
               {/* 3D-ish Desk and Monitors */}
               <div className="flex-1 flex flex-col items-center justify-center -mt-8">
                   
                   {/* Software Icons floating inside "Monitor" area */}
                   <div className="w-[500px] h-[300px] bg-[#1e1e1e] border-[12px] border-slate-800 rounded-xl shadow-2xl relative p-4 mb-4"
                        onClick={(e) => { if (e.target === e.currentTarget) handleInteraction({id: 'monitor', type:'hw', name: 'Màn hình hiển thị'}) }}
                   >
                        {/* Status Light */}
                        <div className="absolute -bottom-[9px] right-4 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
                        
                        {/* Windows content */}
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center border border-slate-700/50 flex flex-col items-start p-4 gap-4">
                             <div draggable onDragStart={() => setDraggedItem({id: 'word', type:'sw', name:'Trình soạn thảo Word'})}
                                  onClick={() => handleInteraction({id: 'word', type:'sw', name:'Trình soạn thảo Word'})}
                                  className={`w-16 h-16 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing group hover:bg-white/10 p-2 rounded transition-colors ${activeSoftware === 'word' ? 'bg-white/20 scale-110' : ''}`}>
                                 <FileText className="text-blue-400 drop-shadow-md" fill="#2563eb" size={32}/>
                                 <span className="text-[10px] text-white font-medium drop-shadow-md bg-black/30 px-1 rounded truncate w-full text-center">Word</span>
                             </div>

                             <div draggable onDragStart={() => setDraggedItem({id: 'paint', type:'sw', name:'Phần mềm Vẽ Paint'})}
                                  onClick={() => handleInteraction({id: 'paint', type:'sw', name:'Phần mềm Vẽ Paint'})}
                                  className={`w-16 h-16 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing group hover:bg-white/10 p-2 rounded transition-colors ${activeSoftware === 'paint' ? 'bg-white/20 scale-110' : ''}`}>
                                 <ImageIcon className="text-amber-400 drop-shadow-md" fill="#d97706" size={32}/>
                                 <span className="text-[10px] text-white font-medium drop-shadow-md bg-black/30 px-1 rounded truncate w-full text-center">Paint</span>
                             </div>

                             {/* Volume Software Icon positioned at bottom right like taskbar */}
                             <div className="absolute bottom-2 right-2 flex gap-2 text-white bg-slate-900/60 p-1.5 rounded backdrop-blur">
                                <Gamepad2 size={16} className="text-slate-300" />
                                <div draggable onDragStart={() => setDraggedItem({id: 'sw_volume', type:'sw', name:'Biểu tượng Âm lượng'})}
                                     onClick={() => handleInteraction({id: 'sw_volume', type:'sw', name:'Biểu tượng Âm lượng'})}
                                     className={`cursor-grab active:cursor-grabbing ${activeSoftware === 'sw_volume' ? 'text-blue-400 scale-125' : 'text-slate-300 hover:text-white'}`}>
                                    <Volume2 size={16} />
                                </div>
                             </div>
                        </div>
                   </div>

                   {/* Desk Stand */}
                   <div className="w-32 h-8 bg-slate-700 -mt-4 mb-2 z-0 relative shadow-md">
                       <div className="absolute bottom-0 w-48 h-2 bg-slate-800 -left-8 rounded-full"></div>
                   </div>

                   {/* Hardware devices below monitor */}
                   <div className="flex items-center gap-12 mt-4">
                       <div draggable onDragStart={() => setDraggedItem({id: 'speaker', type:'hw', name:'Loa ngoài'})}
                            onClick={() => handleInteraction({id: 'speaker', type:'hw', name:'Loa ngoài'})}
                            className={`flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing transition-transform ${activeHardware === 'speaker' ? 'scale-110 -translate-y-2' : 'hover:-translate-y-1'}`}>
                           <div className="w-12 h-20 bg-slate-800 rounded flex flex-col justify-around items-center border-[3px] border-slate-900 shadow-xl overflow-hidden p-1">
                               <div className="w-6 h-6 bg-slate-900 rounded-full border border-slate-600/30"></div>
                               <div className="w-8 h-8 bg-slate-900 rounded-full border border-slate-600/30 font-bold text-center leading-8 text-[8px] text-slate-700">O</div>
                           </div>
                           <span className="text-xs font-bold text-slate-600">Loa ngoài</span>
                       </div>

                       <div draggable onDragStart={() => setDraggedItem({id: 'keyboard', type:'hw', name:'Bàn phím'})}
                            onClick={() => handleInteraction({id: 'keyboard', type:'hw', name:'Bàn phím'})}
                            className={`flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing transition-transform ${activeHardware === 'keyboard' ? 'scale-110 -translate-y-2' : 'hover:-translate-y-1'}`}>
                           <div className="w-64 h-16 bg-slate-200 rounded shrink-0 border-b-4 border-slate-300 shadow-lg flex flex-col p-1.5 gap-0.5 transform rotate-x-12 perspective-[500px]">
                               <div className="flex gap-0.5 justify-around"><div className="w-4 h-4 bg-white shadow-sm border border-slate-300 rounded-sm"></div><div className="w-2/3 h-4 bg-white shadow-sm border border-slate-300 rounded-sm"></div><div className="w-4 h-4 bg-white shadow-sm border border-slate-300 rounded-sm"></div></div>
                               <div className="flex gap-0.5 justify-around mt-1"><div className="w-10 h-4 bg-white shadow-sm border border-slate-300 rounded-sm"></div><div className="w-10 h-4 bg-white shadow-sm border border-slate-300 rounded-sm"></div><div className="w-10 h-4 bg-white shadow-sm border border-slate-300 rounded-sm"></div><div className="w-10 h-4 bg-white shadow-sm border border-slate-300 rounded-sm"></div></div>
                               <div className="flex gap-0.5 justify-center mt-1"><div className="w-1/2 h-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-slate-300 rounded-sm"></div></div>
                           </div>
                           <span className="text-xs font-bold text-slate-600">Bàn phím</span>
                       </div>

                       <div draggable onDragStart={() => setDraggedItem({id: 'mouse', type:'hw', name:'Chuột máy tính'})}
                            onClick={() => handleInteraction({id: 'mouse', type:'hw', name:'Chuột máy tính'})}
                            className={`flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing transition-transform ${activeHardware === 'mouse' ? 'scale-110 -translate-y-2' : 'hover:-translate-y-1'}`}>
                           <div className="w-10 h-16 bg-slate-800 rounded-full shadow-lg border-2 border-slate-900 border-t-4 flex justify-center relative overflow-hidden">
                               <div className="w-px h-6 bg-slate-900 absolute top-0"></div>
                               <div className="w-2 h-4 bg-slate-900 rounded-full mt-1.5 z-10 shadow-inner"></div>
                           </div>
                           <span className="text-xs font-bold text-slate-600">Chuột</span>
                       </div>
                   </div>
               </div>

               {/* Bins for drag/drop classification */}
               <div className="flex justify-center gap-12 mt-8 z-10">
                   <div 
                       onDragEnter={e => e.preventDefault()}
                       onDragOver={e => e.preventDefault()}
                       onDrop={() => handleDrop('hw')}
                       className="w-40 h-32 bg-slate-200 border-2 border-dashed border-slate-400 rounded-xl flex flex-col items-center justify-center text-slate-500 gap-2 hover:bg-slate-300 transition-colors shadow-inner"
                   >
                       <HardDrive size={32} />
                       <span className="font-bold text-sm text-center">Thùng Phần Cứng<br/><span className="text-xs font-medium opacity-75">(Kéo thả vào đây)</span></span>
                   </div>
                   <div 
                       onDragEnter={e => e.preventDefault()}
                       onDragOver={e => e.preventDefault()}
                       onDrop={() => handleDrop('sw')}
                       className="w-40 h-32 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center text-blue-500 gap-2 hover:bg-blue-100 transition-colors shadow-inner"
                   >
                       <Monitor size={32} />
                       <span className="font-bold text-sm text-center">Thùng Phần Mềm<br/><span className="text-xs font-medium opacity-75">(Kéo thả vào đây)</span></span>
                   </div>
               </div>
           </div>

           {/* AI Chat Sidebar */}
           <div className="w-80 border-l border-slate-700/50 bg-slate-800 flex flex-col shrink-0">
               <div className="p-4 bg-slate-900 border-b border-slate-700/50 flex flex-col pt-6 font-medium text-blue-400">
                   <div className="flex items-center gap-2 mb-1">
                      <Bot size={20} />
                      <h3>AI Hướng Dẫn</h3>
                   </div>
                   <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Giáo sư Máy Tính</span>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm font-medium">
                   {messages.map((m, i) => (
                       <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[90%] p-3 rounded-2xl leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-700 text-slate-200 rounded-bl-sm border border-slate-600/50'}`}>
                               {m.content}
                           </div>
                       </div>
                   ))}
                   {isGenerating && (
                       <div className="flex justify-start">
                           <div className="bg-slate-700 text-slate-400 p-3 rounded-2xl rounded-bl-sm border border-slate-600/50 flex items-center gap-1.5 max-w-max h-[44px]">
                               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                           </div>
                       </div>
                   )}
               </div>

               <div className="p-3 bg-slate-900 border-t border-slate-700/50">
                   <div className="bg-slate-800 border border-slate-700 rounded-full flex items-center pr-1 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-inner">
                       <input 
                           type="text" 
                           placeholder="Hỏi thầy giáo AI..."
                           className="flex-1 bg-transparent border-none px-4 py-2 text-sm text-white outline-none"
                           value={chatInput}
                           onChange={e => setChatInput(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                       />
                       <button onClick={handleSendChat} disabled={isGenerating || !chatInput.trim()} className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50 transition-colors shadow">
                           <Send size={16} />
                       </button>
                   </div>
               </div>
           </div>
       </div>
   );
};
