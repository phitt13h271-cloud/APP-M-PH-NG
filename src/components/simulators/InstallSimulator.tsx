import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Box, Key, Download } from 'lucide-react';

export const InstallSimulator: React.FC<{ data: any }> = () => {
   const [step, setStep] = useState(1);

   return (
       <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 md:p-8 relative">
           
           <div className="absolute top-8 bg-slate-800/80 px-6 py-3 rounded-full border border-slate-600 text-slate-300 text-sm md:text-base font-medium shadow-lg z-20 backdrop-blur text-center max-w-2xl">
               Mô phỏng cài đặt: "Ứng dụng học tập tuyệt đỉnh" yêu cầu License Key bản quyền. Hãy thử các lựa chọn xem chuyện gì sẽ xảy ra.
           </div>

           {step === 1 && (
               <div className="bg-[#f0f0f0] text-slate-800 w-full max-w-2xl rounded-lg shadow-2xl border border-slate-400 overflow-hidden font-sans transform transition-all relative z-10 animate-in fade-in zoom-in-95">
                   <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-2 text-sm font-bold flex justify-between shadow-sm">
                       <span>Ứng dụng học tập tuyệt đỉnh - Setup</span>
                       <span className="cursor-pointer hover:bg-red-500 px-2 rounded">✕</span>
                   </div>
                   <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                       <Box size={72} className="text-blue-600 flex-shrink-0 drop-shadow-lg hidden md:block" />
                       <div className="flex-1">
                           <h2 className="text-2xl font-bold mb-2">Kích hoạt phần mềm</h2>
                           <p className="text-sm text-slate-600 mb-6 leading-relaxed">Xin vui lòng nhập License Key (Khoá bản quyền) gồm 20 ký tự đã được cung cấp khi bạn mua phần mềm để tiếp tục cài đặt.</p>
                           
                           <div className="bg-white p-4 border border-slate-300 rounded shadow-inner mb-6 relative">
                               <Key size={16} className="absolute left-3 top-3 text-slate-400" />
                               <input type="text" placeholder="XXXXX-XXXXX-XXXXX-XXXXX" className="w-full pl-8 pr-3 py-1 outline-none uppercase font-mono text-center tracking-[0.2em] font-bold text-slate-800" />
                           </div>

                           <div className="flex flex-col gap-3">
                               <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded text-sm font-bold shadow transition-colors flex items-center justify-center gap-2">
                                   <ShieldCheck size={18}/> Kích hoạt & Cài đặt an toàn
                               </button>
                               <div className="text-center my-1 text-xs text-slate-400">Hoặc</div>
                               <button onClick={() => setStep(3)} className="bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-700 px-4 py-2.5 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                   <Download size={16}/> Tải bản bẻ khóa (Crack) miễn phí
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {step === 2 && (
               <div className="bg-[#f0f0f0] text-slate-800 w-full max-w-xl rounded-lg shadow-[0_0_50px_rgba(16,185,129,0.3)] border border-emerald-400 overflow-hidden font-sans animate-in zoom-in-95 duration-500">
                   <div className="bg-emerald-600 text-white px-4 py-2 text-sm font-bold flex justify-between shadow-sm">
                       <span>Cài đặt thành công</span>
                   </div>
                   <div className="p-10 flex flex-col items-center text-center">
                       <ShieldCheck size={80} className="text-emerald-500 mb-6 drop-shadow-md" />
                       <h2 className="text-2xl font-black mb-3 text-emerald-800">Cảm ơn em đã tôn trọng bản quyền!</h2>
                       <div className="bg-emerald-50 text-emerald-900 text-sm p-4 rounded-lg mb-8 leading-relaxed border border-emerald-200">
                           Máy tính của em luôn được an toàn, không có virus và sẽ liên tục được cập nhật các tính năng mới nhất từ nhà sản xuất.
                       </div>
                       <button onClick={() => setStep(1)} className="bg-slate-800 text-white px-8 py-2.5 rounded-full hover:bg-slate-700 shadow-md font-bold transition-transform hover:-translate-y-0.5">Quay lại trải nghiệm</button>
                   </div>
               </div>
           )}

           {step === 3 && (
               <div className="fixed inset-0 bg-red-950/90 backdrop-blur z-50 flex items-center justify-center p-4">
                   <div className="bg-[#111] text-red-500 w-full max-w-2xl rounded-2xl border border-red-700 shadow-[0_0_150px_rgba(220,38,38,0.4)] p-8 md:p-12 flex flex-col items-center text-center animate-in zoom-in spin-in-2 duration-700">
                       <AlertTriangle size={100} className="text-red-500 mb-6 animate-pulse filter drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
                       <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter text-red-500 drop-shadow-md">CẢNH BÁO MÃ ĐỘC!</h1>
                       <div className="bg-red-950/50 border border-red-900/80 p-6 rounded-xl mb-8">
                           <p className="text-lg md:text-xl font-medium leading-relaxed text-red-200">
                               Phần mềm bẻ khóa (Crack) ẩn chứa mã độc tống tiền (Ransomware). 
                               Toàn bộ dữ liệu bài tập và hình ảnh của em đều đang có nguy cơ bị khóa hoặc đánh cắp!
                           </p>
                       </div>
                       <button onClick={() => setStep(1)} className="bg-red-600 text-white font-bold px-8 py-4 rounded-full hover:bg-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] shadow-xl transition-all transform hover:scale-105 uppercase tracking-wide">
                           Gỡ bỏ phần mềm nguy hiểm ngay
                       </button>
                   </div>
               </div>
           )}
       </div>
   );
};
