import React, { useState } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, Home, SearchCode } from 'lucide-react';

export const BrowserSimulator: React.FC<{ data: any }> = ({ data }) => {
  const isSearchMode = data?.mode === 'search';
  const [url, setUrl] = useState(isSearchMode ? 'google.com' : 'thieunien.vn');
  const [inputUrl, setInputUrl] = useState(url);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleNav = (newUrl: string) => {
      setUrl(newUrl);
      setInputUrl(newUrl);
      setShowResults(false);
  };

  return (
    <div className="w-full h-full min-h-[500px] flex flex-col bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-300/20 max-w-5xl mx-auto my-4 text-slate-800 relative z-10 transition-all duration-300">
        
        {/* Browser Chrome Header */}
        <div className="bg-slate-200 border-b border-slate-300 flex flex-wrap items-center px-4 py-2 gap-2 md:gap-4 shadow-sm z-20">
            <div className="flex space-x-1.5 mr-2">
               <div className="w-3 h-3 rounded-full bg-red-400 border border-black/10"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black/10"></div>
               <div className="w-3 h-3 rounded-full bg-green-400 border border-black/10"></div>
            </div>
            <div className="flex space-x-3 text-slate-500 hidden md:flex">
                <ArrowLeft size={18} className="cursor-pointer hover:text-slate-800 transition-colors"/>
                <ArrowRight size={18} className="text-slate-400"/>
                <RotateCw size={18} className="cursor-pointer hover:text-slate-800 transition-colors"/>
                <Home size={18} onClick={() => handleNav('google.com')} className="cursor-pointer hover:text-slate-800 transition-colors"/>
            </div>
            
            <div className="flex-1 bg-white rounded-full px-4 py-1.5 text-sm flex items-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] border border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
               <span className="text-slate-400 font-mono text-xs mr-2 select-none">https://</span>
               <input 
                 value={inputUrl} 
                 onChange={e => setInputUrl(e.target.value)} 
                 onKeyDown={e => e.key === 'Enter' && handleNav(inputUrl)}
                 className="flex-1 outline-none bg-transparent font-medium text-slate-800 placeholder-slate-400"
                 spellCheck={false}
               />
               <SearchCode size={16} className="text-blue-500 ml-2" />
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white relative overflow-auto flex flex-col z-0">
           {url.includes('google.com') ? (
               <div className="flex flex-col items-center justify-center p-8 mt-12 md:mt-24">
                   <div className="text-5xl md:text-7xl font-sans font-bold mb-8 tracking-tighter">
                       <span className="text-[#4285F4]">G</span>
                       <span className="text-[#EA4335]">o</span>
                       <span className="text-[#FBBC05]">o</span>
                       <span className="text-[#4285F4]">g</span>
                       <span className="text-[#34A853]">l</span>
                       <span className="text-[#EA4335]">e</span>
                   </div>
                   <div className="w-full max-w-2xl flex items-center border border-slate-200 rounded-full px-6 py-3 hover:shadow-lg focus-within:shadow-lg transition-all bg-white relative z-20">
                       <Search className="text-slate-400 mr-3 pointer-events-none" size={20}/>
                       <input 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          onKeyDown={e => { if(e.key === 'Enter') setShowResults(true); }}
                          placeholder="Bạn muốn tìm gì..."
                          className="flex-1 outline-none text-lg text-slate-800 bg-transparent"
                       />
                       <button onClick={() => setShowResults(true)} className="ml-4 bg-[#f8f9fa] border border-[#f8f9fa] hover:border-slate-200 px-4 py-1.5 rounded text-sm text-slate-600 font-medium">Tìm Ký Diệu</button>
                   </div>
                   
                   {showResults && (
                       <div className="absolute top-48 md:top-64 left-0 right-0 bottom-0 bg-white border-t border-slate-100 p-6 md:p-12 overflow-y-auto z-10 animate-in slide-in-from-bottom-4 duration-300">
                           <div className="max-w-4xl mx-auto">
                               <div className="text-slate-500 text-sm mb-6 flex items-center gap-4">
                                   <span>Khoảng 12,500,000 kết quả (0.24 giây)</span>
                               </div>
                               <div className="mb-8 group">
                                   <div className="text-xs text-slate-600 mb-1 flex items-center gap-2"><div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px]">W</div> https://vi.wikipedia.org › wiki › {searchQuery || 'ket-qua'}</div>
                                   <div className="text-xl text-[#1a0dab] group-hover:underline cursor-pointer font-medium mb-1 line-clamp-1">{searchQuery || 'Kết quả tìm kiếm'} - Wikipedia tiếng Việt</div>
                                   <div className="text-sm text-[#4d5156] leading-relaxed">Đây là bách khoa toàn thư hiển thị định nghĩa và kiến thức về <b>{searchQuery || 'trang tìm kiếm'}</b>. Chế độ Sandbox cho phép bạn thử nghiệm giả lập kết quả.</div>
                               </div>
                               <div className="mb-8 group">
                                   <div className="text-xs text-slate-600 mb-1 flex items-center gap-2"><div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">N</div> https://thieunien.vn</div>
                                   <div className="text-xl text-[#1a0dab] group-hover:underline cursor-pointer font-medium mb-1 line-clamp-1" onClick={() => handleNav('thieunien.vn')}>Tin tức, học tập và khám phá về khoa học</div>
                                   <div className="text-sm text-[#4d5156] leading-relaxed">Chuyên trang công nghệ và giáo dục dành cho thiếu niên nhi đồng. Những bài học hay về <b>{searchQuery || 'Tin học'}</b>...</div>
                               </div>
                           </div>
                       </div>
                   )}
               </div>
           ) : (
               <div className="h-full flex flex-col animate-in fade-in duration-500">
                   <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md z-10">
                       <div className="font-bold text-xl tracking-tight">THIẾU NIÊN MỚI</div>
                       <div className="hidden md:flex space-x-6 text-sm font-medium">
                           <span className="cursor-pointer hover:text-blue-200">Khoa học</span>
                           <span className="cursor-pointer hover:text-blue-200 border-b-2 border-white pb-1">Tin học lớp 4</span>
                           <span className="cursor-pointer hover:text-blue-200">Thế giới</span>
                       </div>
                   </div>
                   <div className="flex-1 p-8 bg-[#f9fafb] flex flex-col items-center">
                       <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                           <h1 className="text-3xl font-bold mb-4 text-slate-900 leading-tight">Chào mừng em đến với thế giới Mạng máy tính!</h1>
                           <div className="text-slate-500 text-sm mb-6 flex items-center gap-2">Tác giả: Chuyên gia Công nghệ Giáo dục • Vừa xuất bản</div>
                           <p className="text-lg text-slate-700 leading-relaxed max-w-2xl text-justify mb-8">Trang web là tập hợp các văn bản, hình ảnh, âm thanh... Mỗi trang web có một địa chỉ riêng (URL). Em có thể bấm vào các từ có màu xanh để chuyển sang trang mới nhé!</p>
                           
                           <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                               <h3 className="font-bold text-blue-800 mb-2">💡 Thử nghiệm tương tác:</h3>
                               <p className="text-slate-700 mb-4">Hãy nhấn vào liên kết bên dưới để thực hành quay lại cỗ máy tìm kiếm.</p>
                               <button onClick={() => handleNav('google.com')} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg font-medium transition-transform hover:-translate-y-0.5">Quay lại Tìm kiếm</button>
                           </div>
                       </div>
                   </div>
               </div>
           )}
        </div>
    </div>
  );
};
