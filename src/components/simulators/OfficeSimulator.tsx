import React, { useState } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Save } from 'lucide-react';

export const OfficeSimulator: React.FC<{ data: any }> = ({ data }) => {
    const isPresentation = data?.app === 'powerpoint';
    const [content, setContent] = useState('');
    
    return (
        <div className="w-full h-full min-h-[600px] flex flex-col bg-slate-100 rounded-xl overflow-hidden shadow-2xl border border-slate-300 max-w-5xl mx-auto my-4 text-slate-800">
            {/* Header / Ribbon */}
            <div className="bg-[#185abd] text-white flex flex-col transition-colors" style={{ backgroundColor: isPresentation ? '#b7472a' : '#185abd' }}>
                <div className="px-4 py-2 flex items-center justify-between text-sm hide-scrollbar overflow-x-auto">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="font-bold bg-black/20 px-3 py-1 rounded-sm tracking-wide text-xs uppercase">{isPresentation ? 'Trình Chiếu Siêu Cấp' : 'Trình Soạn Thảo Nhí'}</span>
                        <div className="flex gap-1 font-medium pb-px">
                           <span className="px-3 py-1 hover:bg-white/20 rounded-sm cursor-pointer">Tệp</span>
                           <span className="px-3 py-1 bg-white text-slate-900 rounded-t-sm cursor-pointer border-b-2 border-white pointer-events-none">Trang chủ</span>
                           <span className="px-3 py-1 hover:bg-white/20 rounded-sm cursor-pointer">Chèn</span>
                           <span className="px-3 py-1 hover:bg-white/20 rounded-sm cursor-pointer">Định dạng</span>
                        </div>
                    </div>
                    <span className="bg-white/10 px-3 py-1 rounded text-xs hidden md:block">Tài liệu của em.docx</span>
                </div>
                {/* Toolbar */}
                <div className="bg-slate-50 text-slate-700 px-4 py-2.5 flex items-center gap-2 border-b border-slate-300 flex-wrap md:flex-nowrap shadow-sm z-10">
                    <button className="p-1.5 hover:bg-blue-100 rounded flex flex-col items-center gap-1 active:bg-blue-200 transition-colors min-w-[40px] text-slate-600"><Save size={20} className={isPresentation ? 'text-[#b7472a]':'text-[#185abd]'} /><span className="text-[10px] font-medium">Lưu</span></button>
                    <div className="w-px h-8 bg-slate-300 mx-2 hidden md:block"></div>
                    
                    <div className="flex bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
                        <select className="px-3 py-1.5 text-sm bg-transparent outline-none border-r border-slate-200 hover:bg-slate-50 cursor-pointer font-medium"><option>Arial</option><option>Times New Roman</option><option>Calibri</option></select>
                        <select className="px-3 py-1.5 text-sm bg-transparent outline-none hover:bg-slate-50 cursor-pointer font-medium"><option>12</option><option>14</option><option>18</option><option>24</option></select>
                    </div>

                    <div className="w-px h-8 bg-slate-300 mx-2 hidden md:block"></div>
                    
                    <div className="flex bg-white border border-slate-300 rounded shadow-sm overflow-hidden p-0.5 gap-0.5">
                        <button className="p-1.5 hover:bg-slate-100 rounded-sm font-serif font-bold w-8 h-8 flex items-center justify-center focus:bg-slate-200">B</button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-sm font-serif italic w-8 h-8 flex items-center justify-center focus:bg-slate-200">I</button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-sm font-serif underline w-8 h-8 flex items-center justify-center focus:bg-slate-200">U</button>
                    </div>

                    <div className="w-px h-8 bg-slate-300 mx-2 hidden md:block"></div>
                    
                    <div className="flex bg-white border border-slate-300 rounded shadow-sm overflow-hidden p-0.5 gap-0.5">
                        <button className="p-1.5 hover:bg-slate-100 rounded-sm text-slate-600 focus:bg-slate-200"><AlignLeft size={16}/></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-sm text-slate-600 focus:bg-slate-200"><AlignCenter size={16}/></button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-sm text-slate-600 focus:bg-slate-200"><AlignRight size={16}/></button>
                    </div>

                    <div className="flex-1"></div>

                    <button 
                        className={`p-1.5 px-4 rounded shadow-sm flex items-center gap-2 border font-bold text-xs uppercase tracking-wide transition-all ${isPresentation ? 'bg-[#b7472a] text-white hover:bg-[#993b22] border-[#993b22]' : 'bg-[#185abd] text-white hover:bg-[#124594] border-[#124594]'}`}
                        onClick={()=> setContent(p => p + '\n\n[🖼️ Hình ảnh mẫu được chèn ở đây]\n\n')}
                    >
                        <ImageIcon size={16}/> Chèn Ảnh
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-[#e1e1e1] p-4 md:p-8 flex justify-center overflow-y-auto inset-shadow-sm">
                {isPresentation ? (
                    <div className="w-[800px] max-w-full h-auto aspect-video bg-white shadow-md flex flex-col justify-center items-center p-8 md:p-16 text-center border border-slate-300 relative group animate-in fade-in zoom-in-95 duration-500 rounded-sm">
                        
                        <div className="absolute inset-4 border-2 border-dashed border-transparent group-hover:border-slate-200 transition-colors pointer-events-none rounded"></div>

                        <textarea 
                           className="w-full text-4xl md:text-6xl font-bold bg-transparent outline-none text-center resize-none placeholder-slate-300/50 focus:placeholder-slate-200 text-slate-800 transition-colors focus:ring-2 focus:ring-[#b7472a]/20 rounded p-4"
                           placeholder="Nhấn để thêm Tiêu đề"
                           rows={2}
                        />
                        <textarea 
                           className="w-full text-xl md:text-2xl mt-4 md:mt-8 bg-transparent outline-none text-center resize-none placeholder-slate-400/50 focus:placeholder-slate-300 text-slate-600 transition-colors focus:ring-2 focus:ring-[#b7472a]/20 rounded p-4"
                           placeholder="Nhấn để thêm Phụ đề"
                        />
                    </div>
                ) : (
                    <div className="w-[750px] max-w-full bg-white shadow-md p-8 md:p-16 text-[15px] font-sans border border-slate-300 rounded-sm">
                        <textarea 
                           value={content}
                           onChange={e => setContent(e.target.value)}
                           className="w-full h-full min-h-[500px] bg-transparent outline-none resize-none leading-relaxed text-slate-800 placeholder-slate-300 focus:ring-0"
                           placeholder="Em hãy thử gõ một đoạn văn bản ngắn vào đây nhé. Ví dụ: Xin chào, em tên là..."
                        />
                    </div>
                )}
            </div>
            {/* Status */}
            <div className={`text-white text-xs px-4 py-1.5 flex justify-between font-medium`} style={{ backgroundColor: isPresentation ? '#993b22' : '#124594' }}>
                <span>Trang 1 của 1 • 0 từ</span>
                <div className="flex gap-4">
                    <span>Tiếng Việt</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
};
