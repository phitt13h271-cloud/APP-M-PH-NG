import React, { useState, useEffect } from 'react';

export const KeyboardSimulator: React.FC<{ data: any }> = ({ data }) => {
  const isGameMode = data?.mode === 'game';
  const [typed, setTyped] = useState('');
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        setTyped(e.key);
        setTimeout(() => setTyped(''), 300);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const keys = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900 border-2 border-slate-700 rounded-xl">
        <div className="absolute top-8 bg-slate-800/80 px-6 py-3 rounded-full border border-slate-600 text-blue-200 text-base font-medium shadow-lg z-20 backdrop-blur text-center">
            {isGameMode ? "Vui học gõ phím: Gõ phím trên màn hình càng nhanh càng tốt!" : "Mô phỏng: Hãy đặt thử các ngón tay lên phím và gõ phím thực trên màn hình."}
        </div>
        
        {isGameMode && (
           <div className="mb-12 text-3xl text-emerald-400 font-black tracking-[1em] animate-pulse">
               A S D F J K L
           </div>
        )}

        <div className="flex space-x-2 md:space-x-4 bg-slate-800 p-6 rounded-2xl shadow-xl border-b-4 border-slate-950 mt-16">
            {keys.map((k, index) => {
                const isLeftHand = index < 4;
                const isHomeKey = k === 'F' || k === 'J';
                const isActive = typed.toLowerCase() === k.toLowerCase();
                return (
                    <div key={k} className={`w-12 h-12 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-xl md:text-3xl font-bold border-b-4 bg-slate-700 border-slate-900 shadow-lg transition-all ${isActive ? 'translate-y-2 border-b-0 bg-blue-500 text-white shadow-blue-500/50' : 'text-slate-300 hover:bg-slate-600'} relative`}>
                        {k}
                        {isHomeKey && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-slate-400 rounded-full"></div>}
                    </div>
                )
            })}
        </div>
        
        <div className="mt-16 text-slate-400 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-16 md:space-x-32 opacity-80 pointer-events-none">
                <div className="flex flex-col items-center">
                   <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">🖐️</div>
                   <div className="text-xs uppercase font-bold mt-4 tracking-widest text-blue-400">Tay Trái</div>
                </div>
                <div className="flex flex-col items-center">
                   <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] transform scale-x-[-1]">🖐️</div>
                   <div className="text-xs uppercase font-bold mt-4 tracking-widest text-emerald-400">Tay Phải</div>
                </div>
            </div>
            <div className="text-sm font-light mt-4 italic bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">(Ngón trỏ trái đặt phím F, ngón trỏ phải đặt phím J)</div>
        </div>
    </div>
  );
};
