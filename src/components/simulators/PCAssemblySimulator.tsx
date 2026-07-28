import React, { useState } from 'react';
import { Monitor, Mouse, Keyboard as KeyboardIcon } from 'lucide-react';

export const PCAssemblySimulator: React.FC<{ data: any }> = () => {
  const [cables, setCables] = useState({
      monitor: false,
      keyboard: false,
      mouse: false
  });
  const [isOn, setIsOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleCable = (part: keyof typeof cables) => {
      setCables(prev => ({...prev, [part]: true}));
      setErrorMsg('');
  };

  const allConnected = cables.monitor && cables.keyboard && cables.mouse;

  const handlePower = () => {
      if (!allConnected) {
          setErrorMsg("Chưa cắm đủ kết nối (Màn hình, Bàn phím, Chuột) vào thân máy!");
          // Flash connection prompts
      } else {
          setIsOn(!isOn);
          setErrorMsg('');
      }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-slate-900 relative">
      
      {/* Top instruction overlay */}
      <div className="absolute top-4 bg-slate-800/80 px-6 py-2 rounded-full border border-slate-600 text-blue-200 text-sm z-20 backdrop-blur pointer-events-none">
          Mô phỏng lắp ráp: Nhấn vào các nút "Cắm cáp" để nối thiết bị vào thân máy, sau đó bật nguồn.
      </div>

      {errorMsg && (
          <div className="absolute top-20 bg-red-900/80 text-red-100 px-6 py-3 rounded-lg border border-red-500 shadow-xl z-20 animate-bounce">
              {errorMsg}
          </div>
      )}

      {/* Responsive Workspace */}
      <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center overflow-hidden">
        
        {/* Computer Case (Thân máy) */}
        <div className="absolute right-4 md:right-16 bottom-16 md:bottom-24 w-24 md:w-36 h-48 md:h-72 bg-gradient-to-b from-slate-800 to-slate-950 rounded-lg border-2 border-slate-600 flex flex-col items-center p-2 md:p-4 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] z-10 transition-transform hover:scale-105">
            <div className="w-full h-6 md:h-12 border-b border-white/10 mb-auto flex items-center justify-center text-[10px] md:text-xs text-slate-500 bg-slate-900/50 rounded">DVD / USB Drive</div>
            
            {/* Power Button */}
            <button 
               className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] border-4 ${
                   allConnected 
                     ? (isOn ? 'bg-emerald-400 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 'bg-slate-700 border-emerald-500/50 hover:border-emerald-400') 
                     : 'bg-slate-800 border-slate-600'
               }`}
               onClick={handlePower}
               title="Nút Nguồn (Power)"
            >
               <span className={`text-xl ${isOn ? 'text-slate-900' : 'text-slate-400'}`}>⏻</span>
            </button>
            <div className="mt-4 text-xs font-bold text-slate-400">THÂN MÁY</div>
        </div>

        {/* Monitor */}
        <div className="absolute left-4 md:left-12 top-8 md:top-12 w-48 md:w-80 h-32 md:h-56 bg-slate-950 rounded-xl border-4 border-slate-700 flex flex-col items-center justify-center shadow-2xl z-10 p-1 md:p-2 transition-transform hover:scale-105">
            <div className={`w-full h-full rounded transition-all duration-1000 flex items-center justify-center relative overflow-hidden ${isOn ? 'bg-blue-600' : 'bg-black'}`}>
                {isOn ? (
                    <div className="text-white text-center animate-in fade-in zoom-in duration-1000">
                      <div className="text-3xl md:text-5xl mb-2">⊞</div>
                      <div className="text-xs md:text-lg font-light tracking-wider">Windows<br/><span className="text-[10px] md:text-sm text-blue-200">Welcome...</span></div>
                    </div>
                ) : (
                    <div className="absolute flex flex-col items-center mt-8 space-y-2 opacity-50">
                        <Monitor size={48} className="text-slate-600" />
                        <div className="text-slate-600 text-xs font-mono border border-slate-600 px-2 py-0.5 rounded">NO SIGNAL</div>
                    </div>
                )}
            </div>
            <div className="w-12 md:w-20 h-6 md:h-12 bg-slate-800 absolute -bottom-6 md:-bottom-12"></div>
            <div className="w-24 md:w-40 h-2 md:h-3 bg-slate-600 absolute -bottom-8 md:-bottom-15 rounded-full"></div>
            
            {!cables.monitor && (
                <button onClick={() => toggleCable('monitor')} className="absolute -bottom-16 md:-bottom-24 bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 text-xs rounded-full font-bold shadow-lg animate-pulse z-20">
                    🔗 Cắm cáp Màn hình
                </button>
            )}
        </div>

        {/* Keyboard */}
        <div className="absolute left-8 md:left-24 bottom-24 md:bottom-32 w-40 md:w-64 h-12 md:h-20 bg-slate-800 rounded border-b-4 border-slate-900 grid grid-rows-4 gap-0.5 md:gap-1 p-1 md:p-2 shadow-xl z-20 rotate-[-5deg] transition-transform hover:scale-105">
            {[...Array(4)].map((_,i) => <div key={i} className="flex gap-0.5 md:gap-1 justify-center">{[...Array(12)].map((_,j) => <div key={j} className="h-full w-2 md:w-4 bg-slate-700/80 rounded-[1px] md:rounded-sm"></div>)}</div>)}
            <div className="absolute -top-6 flex items-center text-slate-500 text-[10px] font-bold"><KeyboardIcon size={12} className="mr-1"/> BÀN PHÍM</div>
            {!cables.keyboard && (
                <button onClick={() => toggleCable('keyboard')} className="absolute -bottom-10 bg-purple-500 hover:bg-purple-400 text-white px-3 py-1.5 text-xs rounded-full font-bold shadow-lg animate-pulse z-20">
                    🔗 Cắm cáp Bàn phím
                </button>
            )}
        </div>

        {/* Mouse */}
        <div className="absolute left-60 md:left-[450px] bottom-16 md:bottom-24 w-8 md:w-16 h-12 md:h-24 bg-slate-800 rounded-full border-b-4 border-slate-900 flex overflow-hidden shadow-xl z-20 rotate-[15deg] transition-transform hover:scale-105">
            <div className="w-1/2 h-1/2 border-r-2 border-b-2 border-slate-950 bg-slate-700/50 hover:bg-slate-600 transition-colors"></div>
            <div className="w-1/2 h-1/2 border-b-2 border-slate-950 bg-slate-700/50 hover:bg-slate-600 transition-colors"></div>
            <div className="absolute -top-6 left-0 text-slate-500 text-[10px] font-bold flex items-center whitespace-nowrap"><Mouse size={12} className="mr-1"/> CHUỘT</div>
            {!cables.mouse && (
                <button onClick={() => toggleCable('mouse')} className="absolute -bottom-10 -left-4 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 text-xs rounded-full font-bold shadow-lg animate-pulse z-20 whitespace-nowrap">
                    🔗 Cắm chuột
                </button>
            )}
        </div>

        {/* Visual SVGs for Cables based on state */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
           {/* Hardcoded bezier curves drawing from parts to case */}
           {cables.monitor && <path d="M 150 150 Q 300 250 650 350" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="5,5" className="animate-[wiggle_1s_linear_infinite]" opacity={0.6}/>}
           {cables.keyboard && <path d="M 150 350 Q 400 400 650 400" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="5,5" className="animate-[wiggle_1s_linear_infinite]" opacity={0.6}/>}
           {cables.mouse && <path d="M 450 400 Q 550 420 650 420" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="5,5" className="animate-[wiggle_1s_linear_infinite]" opacity={0.6}/>}
        </svg>

      </div>
    </div>
  );
};
