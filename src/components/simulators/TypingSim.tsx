import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Type, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  apiKey: string;
}

interface Bubble {
    id: number;
    char: string;
    x: number;
    y: number;
    speed: number;
}

export const TypingSim: React.FC<Props> = ({ apiKey }) => {
    const [mode, setMode] = useState<'practice' | 'bubbles' | 'poem'>('practice');
    const [targetChar, setTargetChar] = useState('F');
    const [typed, setTyped] = useState('');
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [score, setScore] = useState(0);
    const [poemText] = useState("Con chim hay hot\nNo dung no hot\nCanh da canh de");
    const [poemInput, setPoemInput] = useState('');
    
    const [aiFeedback, setAiFeedback] = useState('Chào em! Hãy đặt tay lên hàng phím A S D F và J K L ; nhé. Cố gắng ghi nhớ vị trí!');

    const keys = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];
    const bubbleSpeedMod = useRef(0.2);

    // AI feedback generator
    const generateFeedback = async (event: string, scoreData?: string) => {
        if (!apiKey) return;
        try {
            const prompt = `Học sinh đang luyện gõ phím. Cập nhật: ${event} ${scoreData || ''}. Đóng vai chuyên gia gõ phím vui vẻ, khen ngợi hoặc động viên ngắn gọn trong 1 câu. Xưng "thầy/cô" gọi "em".`;
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-gemini-key': apiKey },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            if (data.text) setAiFeedback(data.text);
        } catch (e) {}
    };

    // Practice logic
    useEffect(() => {
        if (mode !== 'practice') return;
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (keys.includes(key)) {
                setTyped(key);
                if (key === targetChar) {
                    setTargetChar(keys[Math.floor(Math.random() * keys.length)]);
                }
                setTimeout(() => setTyped(''), 200);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, targetChar]);

    // Bubble game logic
    useEffect(() => {
        if (mode !== 'bubbles') return;
        
        const spawner = setInterval(() => {
            setBubbles(prev => [...prev, {
                id: Date.now(),
                char: keys[Math.floor(Math.random() * keys.length)],
                x: 10 + Math.random() * 80,
                y: 100,
                speed: bubbleSpeedMod.current
            }]);
            bubbleSpeedMod.current += 0.01;
        }, 1500);

        const mover = setInterval(() => {
            setBubbles(prev => {
                const next = prev.map(b => ({ ...b, y: b.y - b.speed }));
                if (next.some(b => b.y < 0)) {
                    // Bubble hit top...
                    // Could penalize here
                }
                return next.filter(b => b.y > 0); // Remove bubbles that hit top
            });
        }, 30);

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            setBubbles(prev => {
                const hit = prev.find(b => b.char === key && b.y > 0);
                if (hit) {
                    setScore(s => {
                        const newScore = s + 10;
                        if (newScore > 0 && newScore % 150 === 0) generateFeedback("Đạt mốc điểm", `Điểm: ${newScore}`);
                        return newScore;
                    });
                    return prev.filter(b => b.id !== hit.id);
                }
                return prev;
            });
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(spawner);
            clearInterval(mover);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mode]);

    // Reset when changing modes
    useEffect(() => {
        setBubbles([]);
        if (mode === 'bubbles') {
            setScore(0);
            bubbleSpeedMod.current = 0.2;
            generateFeedback("Bắt đầu chơi game bong bóng", "");
        } else if (mode === 'poem') {
            setPoemInput('');
            generateFeedback("Thử thách gõ mù đoạn thơ", "");
        } else {
            generateFeedback("Quay lại luyện tập cơ bản", "");
        }
    }, [mode]);

    const handlePoemComplete = () => {
        // Calculate accuracy
        const maxLen = Math.max(poemText.length, poemInput.length);
        let errors = 0;
        for (let i=0; i<maxLen; i++) {
            if (poemText[i] !== poemInput[i]) errors++;
        }
        const acc = Math.round(((maxLen - errors) / maxLen) * 100);
        generateFeedback("Hoàn thành bài gõ thơ", `Độ chính xác: ${acc}%`);
    };

    return (
        <div className="w-full h-full flex flex-col relative bg-slate-950">
            {/* Top Toolbar */}
            <div className="bg-slate-900 border-b border-slate-800 p-2 flex justify-center gap-4 z-20 shadow-lg">
                <button onClick={() => setMode('practice')} className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${mode === 'practice' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>1. Tập Đặt Tay</button>
                <button onClick={() => setMode('bubbles')} className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${mode === 'bubbles' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>2. Game Bong Bóng</button>
                <button onClick={() => setMode('poem')} className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${mode === 'poem' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>3. Gõ Mù (Thơ)</button>
            </div>

            {/* AI Floating Notifier */}
            <div className="absolute top-16 right-4 max-w-sm bg-slate-800/90 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl shadow-2xl z-30 flex gap-3 items-start animate-in slide-in-from-right">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                    <Bot size={20} className="text-white"/>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Cố vấn Gõ phím</h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">{aiFeedback}</p>
                </div>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
                
                {/* PRACTICE MODE */}
                {mode === 'practice' && (
                    <div className="flex flex-col items-center w-full max-w-4xl animate-in zoom-in-95">
                        <div className="text-5xl font-black text-white mb-12 flex flex-col items-center">
                            Gõ phím: <span className="text-8xl text-emerald-400 mt-4 filter drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]">{targetChar}</span>
                        </div>
                        
                        {/* Hands and Keyboard */}
                        <div className="relative">
                            <div className="flex space-x-2 md:space-x-4 bg-slate-800 p-6 rounded-2xl shadow-xl border-b-8 border-slate-950 relative z-10">
                                {keys.map((k, index) => {
                                    const isHomeKey = k === 'F' || k === 'J';
                                    const isActive = typed === k;
                                    const isTarget = targetChar === k;
                                    
                                    // Colored keys based on finger
                                    const colorClass = index === 0 || index === 7 ? 'text-pink-400 border-pink-900/30' :
                                                       index === 1 || index === 6 ? 'text-amber-400 border-amber-900/30' :
                                                       index === 2 || index === 5 ? 'text-green-400 border-green-900/30' :
                                                                                    'text-blue-400 border-blue-900/30';
                                    
                                    return (
                                        <div key={k} className={`w-14 h-16 md:w-20 md:h-24 rounded-xl flex items-center justify-center text-3xl font-black border-b-[6px] bg-slate-700 shadow-lg transition-all relative
                                            ${isActive ? 'translate-y-2 border-b-0 bg-white text-black shadow-white/50' : `hover:bg-slate-600 ${colorClass}`}
                                            ${isTarget && !isActive ? 'ring-4 ring-emerald-400/80 ring-offset-2 ring-offset-slate-800 animate-pulse' : ''}
                                        `}>
                                            {k}
                                            {isHomeKey && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-5 h-1 bg-slate-400 rounded-full"></div>}
                                        </div>
                                    )
                                })}
                            </div>
                            
                            {/* Ghost Hands overlay */}
                            <div className="absolute -top-16 left-0 w-[45%] h-full pointer-events-none opacity-30 flex justify-center -translate-x-4">
                                <div className="text-[150px] filter drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] scale-x-[-1] origin-center -rotate-12">🖐️</div>
                            </div>
                            <div className="absolute -top-16 right-0 w-[45%] h-full pointer-events-none opacity-30 flex justify-center translate-x-4">
                                <div className="text-[150px] filter drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] rotate-12">🖐️</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BUBBLES MODE */}
                {mode === 'bubbles' && (
                    <div className="w-full h-full relative animate-in fade-in bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                        <div className="absolute top-4 left-6 text-3xl font-black text-indigo-400 drop-shadow-md z-10 flex items-center gap-2">
                            <Sparkles size={28}/> Điểm: {score}
                        </div>
                        
                        {/* Bubbles */}
                        {bubbles.map(b => (
                            <div key={b.id} 
                                 className="absolute w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600/80 to-purple-400/80 border-2 border-white/40 shadow-[0_0_20px_rgba(99,102,241,0.6)] backdrop-blur flex items-center justify-center text-3xl font-black text-white"
                                 style={{ left: `${b.x}%`, bottom: `${b.y}%`, transition: 'bottom 50ms linear' }}
                            >
                                {b.char}
                                <div className="absolute top-2 right-3 w-3 h-3 bg-white/60 rounded-full"></div>
                            </div>
                        ))}
                        
                        {/* Ground/Keyboard hint */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-indigo-950 to-transparent flex items-end justify-center pb-4">
                            <span className="text-indigo-300 font-bold tracking-widest uppercase opacity-50">Sử dụng bàn phím của em để phá vỡ bong bóng!</span>
                        </div>
                    </div>
                )}

                {/* POEM MODE */}
                {mode === 'poem' && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-in zoom-in-95">
                        <div className="max-w-2xl w-full bg-white text-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden text-center">
                            {/* Decorative clip */}
                            <div className="absolute top-0 left-0 w-full h-3 bg-rose-500"></div>
                            
                            <h2 className="text-2xl font-black text-rose-600 mb-8 uppercase tracking-widest">Thử thách gõ mù</h2>
                            
                            <div className="relative mb-8 pt-4 pb-8 min-h-[150px] flex items-center justify-center">
                                {/* The reference text */}
                                <div className="absolute inset-x-0 font-serif text-4xl font-medium leading-relaxed text-slate-300 pointer-events-none whitespace-pre-line text-center">
                                    {poemText}
                                </div>
                                {/* The typed text overlaid */}
                                <div className="absolute inset-x-0 font-serif text-4xl font-bold leading-relaxed whitespace-pre-line text-center z-10 pointer-events-none">
                                    {poemInput.split('').map((char, i) => {
                                        const isCorrect = char === poemText[i];
                                        return (
                                            <span key={i} className={isCorrect ? 'text-slate-800' : 'text-rose-500 bg-rose-100'}>
                                                {char}
                                            </span>
                                        );
                                    })}
                                    <span className="inline-block w-0.5 h-8 bg-blue-500 animate-pulse ml-0.5 align-middle"></span>
                                </div>
                            </div>

                            <textarea 
                                autoFocus
                                className="opacity-0 absolute inset-0 z-0 h-full w-full cursor-default"
                                value={poemInput}
                                onChange={e => {
                                    if (e.target.value.length <= poemText.length) setPoemInput(e.target.value);
                                }}
                            />

                            {poemInput.length === poemText.length && (
                                <button onClick={handlePoemComplete} className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-2 mx-auto transition-transform hover:scale-105">
                                    <CheckCircle2 size={24}/> Hoàn Thành
                                </button>
                            )}
                            
                            <p className="mt-8 text-sm font-bold text-slate-400 bg-slate-100 py-2 px-4 rounded-full inline-block">
                                Nhấp đúp vào trang giấy và bắt đầu gõ. Bàn phím ảo đã bị tắt!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
