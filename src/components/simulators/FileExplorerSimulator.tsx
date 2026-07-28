import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, HardDrive, Monitor, FolderPlus, Trash2 } from 'lucide-react';

export const FileExplorerSimulator: React.FC<{ data: any }> = () => {
    return (
        <div className="w-full h-full min-h-[500px] flex rounded-xl overflow-hidden shadow-2xl border border-slate-600/50 mx-auto max-w-5xl my-4 bg-[#1e1e1e] text-[#d4d4d4] font-sans">
            
            {/* Nav pane (Sidebar) */}
            <div className="w-48 md:w-64 border-r border-[#333333] bg-[#252526] p-4 hidden md:flex flex-col">
                <div className="text-[11px] uppercase text-[#aaaa] font-bold tracking-widest pl-1 mb-2">This PC</div>
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2 py-1.5 px-2 text-[#cccccc] hover:bg-[#2a2d2e] cursor-pointer rounded transition-colors group"><Monitor size={16} className="text-[#cccccc] group-hover:text-blue-400"/> Desktop</div>
                    <div className="flex items-center gap-2 py-1.5 px-2 text-[#cccccc] bg-[#37373d] cursor-pointer rounded shadow-sm group"><Folder size={16} className="text-yellow-500 fill-yellow-500/50"/> Documents</div>
                    <div className="flex items-center gap-2 py-1.5 px-2 text-[#cccccc] hover:bg-[#2a2d2e] cursor-pointer rounded transition-colors group"><Folder size={16} className="text-yellow-500 fill-yellow-500/50"/> Downloads</div>
                    <div className="flex items-center gap-2 py-1.5 px-2 text-[#cccccc] hover:bg-[#2a2d2e] cursor-pointer rounded mt-4 transition-colors group"><HardDrive size={16} className="text-[#aaaa] group-hover:text-slate-300"/> Local Disk (C:)</div>
                    <div className="flex items-center gap-2 py-1.5 px-2 text-[#cccccc] hover:bg-[#2a2d2e] cursor-pointer rounded transition-colors group"><HardDrive size={16} className="text-[#aaaa] group-hover:text-slate-300"/> Data (D:)</div>
                </div>
            </div>

            {/* Main pane */}
            <div className="flex-1 bg-[#1e1e1e] flex flex-col relative overflow-hidden">
                
                {/* Header ribbon */}
                <div className="bg-[#252526] h-14 border-b border-[#333333] flex items-center px-4 space-x-4 shadow-[0_4px_10px_rgba(0,0,0,0.2)] z-10">
                    <button className="flex items-center gap-1.5 text-xs text-[#cccccc] font-medium px-3 py-1.5 rounded hover:bg-[#333333] border border-transparent hover:border-[#444] transition-all"><FolderPlus size={16} className="text-yellow-400"/> New Folder</button>
                    <div className="w-px h-6 bg-[#444444]"></div>
                    <button className="flex items-center gap-1.5 text-xs text-[#cccccc] font-medium px-3 py-1.5 rounded hover:bg-[#333333] border border-transparent hover:border-[#444] transition-all"><Trash2 size={16} className="text-red-400"/> Delete</button>
                </div>

                {/* Address bar */}
                <div className="h-10 border-b border-[#333333] flex items-center px-4 bg-[#1e1e1e] text-sm gap-2 shadow-sm z-0">
                    <Monitor size={14} className="text-slate-400" />
                    <ChevronRight size={14} className="text-slate-600"/>
                    <span className="text-slate-400 cursor-pointer hover:text-blue-300 hover:underline">This PC</span> 
                    <ChevronRight size={14} className="text-slate-600"/> 
                    <span className="text-[#cccccc] font-bold">Documents</span>
                </div>
                
                {/* Content grid */}
                <div className="flex-1 p-6 grid grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-6 content-start overflow-y-auto">
                    
                    {/* Simulated Items */}
                    <div className="flex flex-col items-center justify-start p-2 hover:bg-white/5 rounded cursor-pointer group active:bg-blue-500/20 active:border active:border-blue-500/50 outline-none focus:bg-blue-500/20" tabIndex={0}>
                        <Folder size={64} className="text-yellow-500 fill-yellow-500/40 mb-2 group-hover:fill-yellow-500/60 drop-shadow-md"/>
                        <span className="text-xs text-center font-medium line-clamp-2 px-1 group-focus:bg-blue-600 group-focus:text-white rounded">BaiTapTinHoc</span>
                    </div>

                    <div className="flex flex-col items-center justify-start p-2 hover:bg-white/5 rounded cursor-pointer group active:bg-blue-500/20 active:border active:border-blue-500/50 outline-none focus:bg-blue-500/20" tabIndex={0}>
                        <Folder size={64} className="text-yellow-500 fill-yellow-500/40 mb-2 group-hover:fill-yellow-500/60 drop-shadow-md"/>
                        <span className="text-xs text-center font-medium line-clamp-2 px-1 group-focus:bg-blue-600 group-focus:text-white rounded">AnhThe_4A</span>
                    </div>

                    <div className="flex flex-col items-center justify-start p-2 hover:bg-white/5 rounded cursor-pointer group active:bg-blue-500/20 active:border active:border-blue-500/50 outline-none focus:bg-blue-500/20" tabIndex={0}>
                        <FileText size={64} className="text-blue-500 fill-blue-500/20 mb-2 drop-shadow-md"/>
                        <span className="text-xs text-center font-medium line-clamp-2 px-1 group-focus:bg-blue-600 group-focus:text-white rounded">GioiThieuBanThan.docx</span>
                    </div>

                </div>

                {/* StatusBar */}
                <div className="h-6 border-t border-[#333333] bg-[#007acc] text-white flex items-center px-4 text-[10px] uppercase font-bold justify-between">
                    <span>3 items</span>
                    <span>Simulated File Explorer</span>
                </div>
            </div>
        </div>
    );
};
