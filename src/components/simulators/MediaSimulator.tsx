import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize, Image as ImageIcon, Video, Music } from 'lucide-react';

export const MediaSimulator: React.FC<{ data: any }> = ({ data }) => {
    // Mode defaults to video if not provided
    const isVideo = data?.mode !== 'image'; 
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="w-full h-full min-h-[500px] flex rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 mx-auto max-w-5xl my-4 bg-[#0f172a] text-slate-200">
            {/* Playlist Sidebar */}
            <div className="w-72 bg-[#0b1120] border-r border-slate-800 p-4 hidden md:flex flex-col z-20 shadow-xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 mt-2 px-2">Danh sách phát</h3>
                <div className="space-y-1.5 flex-1 overflow-y-auto">
                    <div className={`p-2.5 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${isVideo ? 'bg-blue-600/10 border border-blue-500/30 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]' : 'hover:bg-slate-800 border border-transparent'}`}>
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 shadow-sm ${isVideo?'bg-blue-600 text-white':'bg-slate-800 text-slate-400'}`}><Video size={18}/></div>
                        <div className="flex-1 overflow-hidden">
                            <div className={`text-sm font-bold truncate ${isVideo?'text-blue-400':'text-slate-300'}`}>HocTiengAnh.mp4</div>
                            <div className="text-xs text-slate-500">05:24 • Video Giáo dục</div>
                        </div>
                    </div>
                    <div className={`p-2.5 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${!isVideo ? 'bg-emerald-600/10 border border-emerald-500/30' : 'hover:bg-slate-800 border border-transparent'}`}>
                        <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 shadow-sm ${!isVideo?'bg-emerald-600 text-white':'bg-slate-800 text-slate-400'}`}><ImageIcon size={18}/></div>
                        <div className="flex-1 overflow-hidden">
                            <div className={`text-sm font-bold truncate ${!isVideo?'text-emerald-400':'text-slate-300'}`}>AnhLopMinh.jpg</div>
                            <div className="text-xs text-slate-500">2.4 MB • Hình ảnh</div>
                        </div>
                    </div>
                    <div className="p-2.5 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-800 border border-transparent transition-colors opacity-60">
                        <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0 text-slate-400"><Music size={18}/></div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-bold truncate text-slate-300">NhacKhongLoi.mp3</div>
                            <div className="text-xs text-slate-500">03:15 • Âm thanh</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Player */}
            <div className="flex-1 bg-black flex flex-col relative">
                
                {/* Top Nav (Fake) */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center px-6 pointer-events-none transition-opacity duration-300 opacity-0 hover:opacity-100">
                    <span className="text-white font-medium drop-shadow-md">{isVideo ? 'HocTiengAnh.mp4' : 'AnhLopMinh.jpg'}</span>
                </div>

                {/* Viewing Area */}
                <div className="flex-1 flex items-center justify-center relative overflow-hidden group">
                    {isVideo ? (
                        <>
                            {/* Fake video content */}
                            <div className="w-full h-full bg-[#1e293b] flex items-center justify-center text-slate-500 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 relative">
                                
                                <span className="text-xl font-medium opacity-30 font-mono tracking-[0.3em] z-0 px-8 text-center leading-relaxed backdrop-blur-sm">
                                    [ TRÌNH PHÁT ĐA PHƯƠNG TIỆN ]<br/>
                                    <span className="text-sm">Video đang được mô phỏng</span>
                                </span>
                                
                                {isPlaying && (
                                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                      <div className="w-[120%] h-[120%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[spin_60s_linear_infinite]"></div>
                                   </div>
                                )}
                            </div>
                            
                            {!isPlaying && (
                                <button onClick={() => setIsPlaying(true)} className="absolute z-20 w-24 h-24 bg-blue-600/90 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.6)] backdrop-blur transition-all hover:scale-110 hover:shadow-[0_0_50px_rgba(37,99,235,0.8)] border border-white/10 group-hover:opacity-100">
                                    <Play size={44} className="ml-2 drop-shadow-md" fill="currentColor" />
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center object-cover relative">
                            {/* Vignette */}
                            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border border-white/5"></div>
                        </div>
                    )}
                </div>

                {/* Controls (Only show for Video) */}
                {isVideo && (
                    <div className="h-24 bg-gradient-to-t from-black via-black/90 to-transparent z-20 px-6 md:px-8 flex flex-col justify-end pb-4 gap-3 absolute bottom-0 left-0 right-0 opacity-90 hover:opacity-100 transition-opacity">
                        {/* Scrub bar */}
                        <div className="w-full flex items-center gap-3 text-xs text-slate-300 font-mono">
                            <span>01:15</span>
                            <div className="flex-1 h-2 hover:h-3 transition-all bg-white/20 rounded-full overflow-hidden cursor-pointer group/scrub relative">
                                <div className="h-full bg-blue-500 w-1/4 relative shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                            </div>
                            <span>05:24</span>
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5 text-slate-300">
                                <SkipBack size={24} className="hover:text-white cursor-pointer transition-colors drop-shadow" />
                                <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-transform hover:scale-105 shadow-lg">
                                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                </button>
                                <SkipForward size={24} className="hover:text-white cursor-pointer transition-colors drop-shadow" />
                                
                                <div className="hidden md:flex items-center gap-2 ml-4">
                                    <Volume2 size={20} className="text-slate-200 drop-shadow cursor-pointer hover:text-white" />
                                    <div className="w-24 h-1.5 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all"><div className="w-2/3 h-full bg-white rounded-full"></div></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-200 drop-shadow">
                                <Maximize size={20} className="hover:text-white cursor-pointer transition-colors hover:scale-110" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
