import React, { useState } from 'react';
import { Play, Square, RotateCw, MoveRight, HelpCircle, Flag, MessageCircle } from 'lucide-react';

export const ScratchSimulator: React.FC<{ data: any }> = () => {
    const [catPos, setCatPos] = useState({ x: 0, y: 0, r: 0 });
    const [isRunning, setIsRunning] = useState(false);
    const [saidText, setSaidText] = useState<string | null>(null);

    const runProgram = () => {
        setIsRunning(true);
        setSaidText("Xin chào 👋");
        
        setTimeout(() => { setCatPos(p => ({ ...p, x: p.x + 120 })); setSaidText(null); }, 1000);
        setTimeout(() => setCatPos(p => ({ ...p, r: p.r + 360 })), 2000);
        setTimeout(() => setIsRunning(false), 3000);
    };

    const resetProgram = () => {
        setCatPos({ x: 0, y: 0, r: 0 });
        setSaidText(null);
    };

    return (
        <div className="w-full h-full min-h-[600px] flex rounded-2xl overflow-hidden shadow-2xl border border-slate-200 mx-auto max-w-6xl my-4 bg-white text-slate-800 font-sans">
            
            {/* Blocks Palette */}
            <div className="w-64 border-r border-[#e6f0ff] bg-white flex flex-col hidden md:flex shrink-0">
                <div className="h-12 flex items-center px-4 font-bold border-b border-[#e6f0ff] bg-blue-50 text-blue-800 text-sm tracking-wide">
                    KHỐI LỆNH
                </div>
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {/* Event block */}
                    <div className="bg-[#ffbf00] text-amber-950 px-3 py-2 rounded-lg font-bold text-sm shadow-sm border border-b-4 border-[#cc9900] flex items-center gap-2 w-max cursor-grab hover:-translate-y-0.5 transition-transform">
                        <Flag size={16} fill="white" className="text-white"/> Khi bấm vào cờ xanh
                    </div>
                    
                    {/* Motion block */}
                    <div className="bg-[#4c97ff] text-white px-3 py-2 rounded-lg font-bold text-sm shadow-sm border border-b-4 border-[#3373cc] flex items-center gap-2 w-max cursor-grab hover:-translate-y-0.5 transition-transform">
                        Di chuyển <span className="bg-white text-black px-2 py-0.5 rounded-full min-w-[2rem] text-center shadow-inner">10</span> bước
                    </div>
                    <div className="bg-[#4c97ff] text-white px-3 py-2 rounded-lg font-bold text-sm shadow-sm border border-b-4 border-[#3373cc] flex items-center gap-2 w-max cursor-grab hover:-translate-y-0.5 transition-transform">
                        Xoay <RotateCw size={14}/> <span className="bg-white text-black px-2 py-0.5 rounded-full min-w-[2rem] text-center shadow-inner">15</span> độ
                    </div>
                    
                    {/* Looks block */}
                    <div className="bg-[#9966ff] text-white px-3 py-2 rounded-lg font-bold text-sm shadow-sm border border-b-4 border-[#774dcb] flex items-center gap-2 w-max cursor-grab mt-2 hover:-translate-y-0.5 transition-transform">
                        Nói <span className="bg-white text-black px-2 py-0.5 rounded-full shadow-inner">Xin chào!</span> trong 2 giây
                    </div>
                </div>
            </div>

            {/* Script Area */}
            <div className="flex-1 border-r border-[#e6f0ff] bg-[#f9f9f9] flex flex-col relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
                
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-slate-500 shadow-sm border border-slate-200 flex items-center gap-2">
                    <MessageCircle size={14} className="text-blue-500"/> Kéo thả khối lệnh vào đây để lập trình
                </div>
                
                {/* Simulated Stack */}
                <div className="absolute top-24 left-12 flex flex-col filter drop-shadow-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    
                    {/* Top bump connection (visually empty but implies connectivity) */}
                    
                    <div className="bg-[#ffbf00] text-amber-950 px-4 py-3 font-bold text-[15px] shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] flex items-center gap-2 w-max rounded-t-xl rounded-b-md relative pb-4 z-30">
                        Khi bấm vào  <Flag size={18} fill="white" className="text-white drop-shadow"/>
                        <div className="absolute -bottom-2 left-6 w-8 h-4 bg-[#ffbf00] rounded-b-[10px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] overflow-hidden">
                            <div className="absolute top-0 w-full h-1 bg-black/10"></div>
                        </div>
                    </div>

                    <div className="bg-[#9966ff] text-white px-4 py-3 font-bold text-[15px] shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] flex items-center gap-2 w-max rounded-[4px] relative pb-4 flex-shrink-0 -mt-2 z-20">
                        Nói <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">Xin chào 👋</span>
                        {/* Cutout matching the bump above */}
                        <div className="absolute top-0 left-6 w-8 h-2 bg-[#f9f9f9] rounded-b-[10px] shadow-[inset_0_2px_0_rgba(0,0,0,0.1)] -translate-y-full"></div>
                        {/* Bottom bump */}
                        <div className="absolute -bottom-2 left-6 w-8 h-4 bg-[#9966ff] rounded-b-[10px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] overflow-hidden">
                            <div className="absolute top-0 w-full h-1 bg-black/10"></div>
                        </div>
                    </div>
                    
                    <div className="bg-[#4c97ff] text-white px-4 py-3 font-bold text-[15px] shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] flex items-center gap-2 w-max rounded-[4px] relative pb-4 flex-shrink-0 -mt-2 z-10">
                        Di chuyển <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">100</span> bước
                        <div className="absolute top-0 left-6 w-8 h-2 bg-[#f9f9f9] rounded-b-[10px] shadow-[inset_0_2px_0_rgba(0,0,0,0.1)] -translate-y-full"></div>
                        <div className="absolute -bottom-2 left-6 w-8 h-4 bg-[#4c97ff] rounded-b-[10px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] overflow-hidden">
                            <div className="absolute top-0 w-full h-1 bg-black/10"></div>
                        </div>
                    </div>
                    
                    <div className="bg-[#4c97ff] text-white px-4 py-3 font-bold text-[15px] shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] flex items-center gap-2 w-max rounded-[4px] rounded-b-xl relative -mt-2 z-0">
                        Xoay <RotateCw size={16}/> xoay tròn
                        <div className="absolute top-0 left-6 w-8 h-2 bg-[#f9f9f9] rounded-b-[10px] shadow-[inset_0_2px_0_rgba(0,0,0,0.1)] -translate-y-full"></div>
                    </div>
                </div>
            </div>

            {/* Stage */}
            <div className="w-80 md:w-96 flex flex-col bg-white shrink-0">
                <div className="h-12 flex items-center justify-between px-4 font-bold border-b border-slate-200 bg-slate-50">
                    <span className="text-slate-600 text-sm tracking-wide">SÂN KHẤU</span>
                    <div className="flex gap-2">
                        {/* Green flag button */}
                        <button 
                            onClick={runProgram} 
                            disabled={isRunning} 
                            className="bg-green-500 text-white w-9 h-8 rounded shrink-0 flex items-center justify-center hover:bg-green-400 active:bg-green-600 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            <Flag size={18} fill="currentColor" />
                        </button>
                        {/* Stop button */}
                        <button 
                            onClick={resetProgram} 
                            className="bg-[#ff4c4c] text-white w-9 h-8 rounded shrink-0 flex items-center justify-center hover:bg-red-400 active:bg-red-600 transition-colors shadow-sm"
                        >
                            <Square size={16} fill="currentColor" />
                        </button>
                    </div>
                </div>
                
                {/* Stage Canvas */}
                <div className="h-72 border-b border-slate-200 bg-white relative overflow-hidden flex items-center justify-center">
                    
                    {/* Actor (Cat) */}
                    <div 
                        className="text-7xl absolute transition-all ease-in-out z-20 flex flex-col items-center"
                        style={{
                            transform: `translate(${catPos.x - 50}px, ${catPos.y}px) rotate(${catPos.r}deg)`,
                            filter: isRunning ? 'drop-shadow(0 15px 10px rgba(0,0,0,0.2)) text-shadow-sm' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                            transitionDuration: catPos.x > 0 ? '1000ms' : '0ms' // instant reset
                        }}
                    >
                        {saidText && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-lg text-sm font-bold text-slate-800 whitespace-nowrap z-30 animate-in fade-in zoom-in slide-in-from-bottom-2">
                                {saidText}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-slate-200 rotate-45"></div>
                            </div>
                        )}
                        🐱
                    </div>
                </div>
                
                {/* Sprite panel */}
                <div className="p-4 bg-slate-50 flex-1">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Tên nhân vật</div>
                            <input type="text" value="Sprite1" readOnly className="w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white font-medium outline-none text-slate-700"/>
                        </div>
                        <div className="flex gap-2">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">X</div>
                                <div className="w-12 border border-slate-300 rounded px-2 py-1 text-sm bg-white font-mono text-center text-slate-700">{Math.round(catPos.x)}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Y</div>
                                <div className="w-12 border border-slate-300 rounded px-2 py-1 text-sm bg-white font-mono text-center text-slate-700">{Math.round(-catPos.y)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <div className="p-2 border-2 border-blue-500 rounded-lg flex flex-col items-center justify-center w-16 h-16 bg-white shadow-sm cursor-pointer relative">
                            <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
                            <span className="text-3xl">🐱</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
