import React, { useState, useEffect } from 'react';
import { Settings, Bell, User, Search, Sparkles, Upload, FileText, Laptop, MonitorPlay, Check, Loader2, Play, HelpCircle, Code, ChevronRight, ChevronDown, RotateCcw, Box, ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Terminal, MousePointer2 } from 'lucide-react';

export default function SimulationAssistantApp() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  
  // Form State
  const [subject, setSubject] = useState('Tin học');
  const [grade, setGrade] = useState('Lớp 4');
  const [topic, setTopic] = useState('Điều khiển Rô-bốt & Thuật toán tuần tự');
  const [params, setParams] = useState('');
  const [device, setDevice] = useState('laptop');
  const [internet, setInternet] = useState('yes');

  // Simulation State
  const gridSize = 8;
  const [robotPos, setRobotPos] = useState({ x: 1, y: 1 });
  const [robotDir, setRobotDir] = useState(0); // 0=right, 90=down, 180=left, 270=up
  const [showGrid, setShowGrid] = useState(true);
  const [showCoords, setShowCoords] = useState(false);
  const [showTrail, setShowTrail] = useState(true);
  const [trail, setTrail] = useState<{x:number, y:number}[]>([{x:1, y:1}]);
  
  const [activeTab, setActiveTab] = useState('mophong');

  const handleGenerate = () => {
    setStep('loading');
    setTimeout(() => {
      setStep('result');
    }, 3000);
  };

  const resetSim = () => {
    setRobotPos({ x: 1, y: 1 });
    setRobotDir(0);
    setTrail([{x:1, y:1}]);
  };

  const moveForward = () => {
    let nx = robotPos.x;
    let ny = robotPos.y;
    if (robotDir === 0) nx += 1;
    if (robotDir === 90) ny += 1;
    if (robotDir === 180) nx -= 1;
    if (robotDir === 270) ny -= 1;
    
    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
      setRobotPos({ x: nx, y: ny });
      setTrail([...trail, { x: nx, y: ny }]);
    }
  };

  const turnRight = () => setRobotDir((prev) => (prev + 90) % 360);
  const turnLeft = () => setRobotDir((prev) => (prev - 90 + 360) % 360);

  const getDirIcon = () => {
      if (robotDir === 0) return <ArrowRight size={24} className="text-teal-700" />;
      if (robotDir === 90) return <ArrowDown size={24} className="text-teal-700" />;
      if (robotDir === 180) return <ArrowLeft size={24} className="text-teal-700" />;
      return <ArrowUp size={24} className="text-teal-700" />;
  };

  const TabItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => {
      const active = activeTab === id;
      return (
          <button 
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-semibold shadow-sm ${active ? 'bg-teal-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-100'}`}
          >
            <Icon size={20} className={active ? "text-white" : "text-teal-600"} />
            <span>{label}</span>
          </button>
      )
  };

  if (step === 'loading') {
      return (
          <div className="min-h-screen bg-teal-50/50 flex flex-col items-center justify-center p-6 text-center font-sans">
              <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-teal-100 animate-in zoom-in-95 duration-500 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin flex items-center justify-center mb-8 relative">
                      <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                          <Sparkles className="text-teal-600" size={32} />
                      </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Đang khởi tạo mô phỏng...</h2>
                  <p className="text-slate-500 mb-8 leading-relaxed">AI đang viết mã HTML, Canvas logic và thiết kế giao diện cho chủ đề <b>"{topic}"</b></p>
                  
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full w-1/2 animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDuration: '1.5s', width: '60%' }}></div>
                  </div>
              </div>
          </div>
      );
  }

  if (step === 'result') {
      return (
          <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
              <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-2 text-teal-600 cursor-pointer" onClick={() => setStep('form')}>
                  <div className="p-1.5 bg-teal-100 rounded-lg">
                    <MonitorPlay size={24} />
                  </div>
                  <h1 className="font-black text-lg tracking-tight uppercase">Trợ lý tạo mô phỏng</h1>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <Settings size={20} className="hover:text-teal-600 cursor-pointer transition-colors" />
                  <Bell size={20} className="hover:text-teal-600 cursor-pointer transition-colors" />
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center border border-teal-200 text-teal-700">
                    <User size={16} />
                  </div>
                </div>
              </header>

              <div className="max-w-3xl mx-auto p-4 space-y-6 mt-4">
                  {/* Canvas Area */}
                  <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 overflow-x-auto">
                          <div 
                              className="relative mx-auto bg-white border-2 border-slate-300"
                              style={{ 
                                  width: '100%', 
                                  maxWidth: '400px', 
                                  aspectRatio: '1/1',
                                  backgroundImage: showGrid ? 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)' : 'none',
                                  backgroundSize: `calc(100% / ${gridSize}) calc(100% / ${gridSize})`
                              }}
                          >
                              {/* Grid Coordinates */}
                              {showCoords && Array.from({ length: gridSize }).map((_, i) => (
                                  <React.Fragment key={i}>
                                      <div className="absolute top-0 text-[10px] text-slate-400 font-mono -mt-4 text-center" style={{ left: `calc(${i} * 100% / ${gridSize} + 100% / ${gridSize} / 2)`, transform: 'translateX(-50%)' }}>{i}</div>
                                      <div className="absolute left-0 text-[10px] text-slate-400 font-mono -ml-4 flex items-center" style={{ top: `calc(${i} * 100% / ${gridSize} + 100% / ${gridSize} / 2)`, transform: 'translateY(-50%)' }}>{i}</div>
                                  </React.Fragment>
                              ))}

                              {/* Trail */}
                              {showTrail && trail.map((pt, i) => (
                                  <div 
                                      key={i}
                                      className="absolute bg-teal-200 opacity-50 rounded-sm"
                                      style={{
                                          width: `calc(100% / ${gridSize})`,
                                          height: `calc(100% / ${gridSize})`,
                                          left: `calc(${pt.x} * 100% / ${gridSize})`,
                                          top: `calc(${pt.y} * 100% / ${gridSize})`,
                                      }}
                                  />
                              ))}

                              {/* Robot */}
                              <div 
                                  className="absolute flex items-center justify-center transition-all duration-300 ease-in-out"
                                  style={{
                                      width: `calc(100% / ${gridSize})`,
                                      height: `calc(100% / ${gridSize})`,
                                      left: `calc(${robotPos.x} * 100% / ${gridSize})`,
                                      top: `calc(${robotPos.y} * 100% / ${gridSize})`,
                                  }}
                              >
                                  <div className="w-4/5 h-4/5 bg-teal-100 border-2 border-teal-500 rounded-lg flex items-center justify-center shadow-md relative z-10">
                                      {getDirIcon()}
                                  </div>
                              </div>
                              
                              {/* Target */}
                              <div 
                                  className="absolute flex items-center justify-center"
                                  style={{
                                      width: `calc(100% / ${gridSize})`,
                                      height: `calc(100% / ${gridSize})`,
                                      left: `calc(6 * 100% / ${gridSize})`,
                                      top: `calc(6 * 100% / ${gridSize})`,
                                  }}
                              >
                                  <div className="text-2xl animate-bounce drop-shadow-md">🚩</div>
                              </div>
                          </div>
                      </div>

                      <div className="absolute bottom-4 left-4">
                          <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              INTERACTIVE READY
                          </div>
                      </div>
                  </div>

                  {/* Content Tabs */}
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-500 text-sm tracking-wider uppercase ml-2">NỘI DUNG</h3>
                      
                      <div className="space-y-3">
                          <TabItem id="mophong" icon={Play} label="Mô phỏng" />
                          
                          {activeTab === 'mophong' && (
                              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mx-2 animate-in slide-in-from-top-2 duration-200">
                                  <h4 className="font-bold text-slate-800 mb-4 text-lg">Điều khiển & Thông số</h4>
                                  
                                  <div className="grid grid-cols-2 gap-3 mb-6">
                                      <button onClick={turnLeft} className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                                          <RotateCcw size={18} /> Quay Trái
                                      </button>
                                      <button onClick={turnRight} className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                                          <RotateCcw size={18} className="scale-x-[-1]" /> Quay Phải
                                      </button>
                                      <button onClick={moveForward} className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 col-span-2 shadow-md transition-colors">
                                          <ArrowUp size={20} /> Tiến Lên 1 Bước
                                      </button>
                                  </div>

                                  <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-5">
                                      <button onClick={resetSim} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors text-sm">
                                          Làm mới (Reset)
                                      </button>
                                  </div>

                                  <div className="space-y-3 mb-6">
                                      <label className="flex items-center gap-3 cursor-pointer group">
                                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${showGrid ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                              {showGrid && <Check size={14} className="text-white" />}
                                          </div>
                                          <input type="checkbox" className="hidden" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} />
                                          <span className="text-slate-700">Hiển thị lưới nền</span>
                                      </label>
                                      <label className="flex items-center gap-3 cursor-pointer group">
                                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${showCoords ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                              {showCoords && <Check size={14} className="text-white" />}
                                          </div>
                                          <input type="checkbox" className="hidden" checked={showCoords} onChange={(e) => setShowCoords(e.target.checked)} />
                                          <span className="text-slate-700">Hiển thị tọa độ (x, y)</span>
                                      </label>
                                       <label className="flex items-center gap-3 cursor-pointer group">
                                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${showTrail ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                              {showTrail && <Check size={14} className="text-white" />}
                                          </div>
                                          <input type="checkbox" className="hidden" checked={showTrail} onChange={(e) => setShowTrail(e.target.checked)} />
                                          <span className="text-slate-700">Hiển thị vệt đường đi</span>
                                      </label>
                                  </div>

                                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                      <h5 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Trạng thái hiện tại:</h5>
                                      <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-slate-700 font-medium">
                                          <div className="flex justify-between border-b border-blue-100 pb-2">
                                              <span className="text-slate-500">Vị trí X:</span>
                                              <span className="text-blue-700 font-bold">{robotPos.x}</span>
                                          </div>
                                          <div className="flex justify-between border-b border-blue-100 pb-2">
                                              <span className="text-slate-500">Vị trí Y:</span>
                                              <span className="text-blue-700 font-bold">{robotPos.y}</span>
                                          </div>
                                          <div className="flex justify-between border-b border-blue-100 pb-2">
                                              <span className="text-slate-500">Hướng:</span>
                                              <span className="text-blue-700 font-bold">{robotDir}°</span>
                                          </div>
                                           <div className="flex justify-between border-b border-blue-100 pb-2">
                                              <span className="text-slate-500">Số bước:</span>
                                              <span className="text-blue-700 font-bold">{trail.length - 1}</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          <TabItem id="cauhoi" icon={HelpCircle} label="Câu hỏi thực hành" />
                          <TabItem id="huongdan" icon={FileText} label="Hướng dẫn GV" />
                          <TabItem id="source" icon={Code} label="Source Code" />
                      </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                      <div className="flex items-center gap-2 text-teal-600 mb-4">
                          <Sparkles size={20} />
                          <h3 className="font-bold text-lg">AI Analysis</h3>
                      </div>
                      
                      <p className="text-slate-600 mb-6 leading-relaxed">
                          Mô phỏng này được tạo tự động dựa trên các khái niệm Khoa học Máy tính tiêu chuẩn dành cho cấp tiểu học.
                      </p>
                      
                      <div className="relative z-10 bg-teal-50 border-l-4 border-teal-500 p-5 rounded-r-xl italic text-teal-900 font-medium leading-relaxed mb-6">
                          "Học sinh có thể tương tác trực tiếp với các lệnh điều khiển để quan sát sự thay đổi trạng thái của rô-bốt (vị trí, hướng) trên lưới tọa độ trong thời gian thực, giúp rèn luyện tư duy thuật toán tuần tự."
                      </div>
                      
                      <div className="space-y-3">
                          <div className="flex items-center gap-3">
                              <Check size={18} className="text-emerald-500" />
                              <span className="font-bold text-slate-700 min-w-[100px]">Responsive:</span>
                              <span className="text-slate-600">Mobile/Tablet/PC</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <Check size={18} className="text-emerald-500" />
                              <span className="font-bold text-slate-700 min-w-[100px]">Offline:</span>
                              <span className="text-slate-600">Chạy không cần mạng</span>
                          </div>
                      </div>
                      
                      {/* Decorative background blob */}
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl -z-0"></div>
                  </div>
              </div>
          </div>
      );
  }

  // Form View
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-teal-600">
          <div className="p-1.5 bg-teal-100 rounded-lg">
            <MonitorPlay size={24} />
          </div>
          <h1 className="font-black text-lg tracking-tight uppercase">Trợ lý tạo mô phỏng</h1>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <Settings size={20} className="hover:text-teal-600 cursor-pointer transition-colors" />
          <Bell size={20} className="hover:text-teal-600 cursor-pointer transition-colors" />
          <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center border border-teal-200 text-teal-700">
            <User size={16} />
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-8 mt-4">
        {/* Step 1 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center font-black shadow-md text-lg">1</div>
            <h2 className="font-black text-slate-800 text-lg tracking-tight uppercase">Thông tin cơ bản</h2>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Box size={14} /> Môn học
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Terminal size={18} className="text-teal-600" />
                    </div>
                    <input 
                        type="text" 
                        value={subject} 
                        onChange={e => setSubject(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all shadow-sm"
                        readOnly
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <div className="w-1.5 h-6 bg-teal-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={14} /> Đối tượng
                </label>
                <input 
                    type="text" 
                    value={grade} 
                    onChange={e => setGrade(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all shadow-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                <button className="bg-teal-50 text-teal-700 py-3 rounded-xl font-bold border-2 border-teal-100 flex items-center justify-center gap-2">
                    <FileText size={18} /> Nhập chủ đề
                </button>
                <button className="bg-white text-slate-600 py-3 rounded-xl font-semibold border-2 border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                    <Upload size={18} /> Tải file bài tập
                </button>
            </div>

            <div>
                 <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    Chủ đề chi tiết <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    value={topic} 
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all shadow-sm"
                    placeholder="VD: Điều khiển rô-bốt, Các bộ phận máy tính..."
                />
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-slate-500 text-white flex items-center justify-center font-black shadow-md text-lg">2</div>
            <h2 className="font-black text-slate-800 text-lg tracking-tight uppercase">Chi tiết nâng cao</h2>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div>
                 <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Settings size={14} /> Thông số điều chỉnh
                </label>
                <textarea 
                    value={params} 
                    onChange={e => setParams(e.target.value)}
                    className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl font-medium text-slate-700 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-50 transition-all shadow-sm h-32 resize-none"
                    placeholder="Kích thước lưới, vị trí đích, chướng ngại vật..."
                />
            </div>

            <div>
                 <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Thiết bị hiển thị</label>
                 <div className="grid grid-cols-2 gap-3">
                     <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${device === 'laptop' ? 'bg-blue-500 border-blue-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'}`}>
                         <div className={`w-5 h-5 rounded flex items-center justify-center border ${device === 'laptop' ? 'bg-white/20 border-white text-white' : 'border-slate-300'}`}>
                             {device === 'laptop' && <Check size={14} />}
                         </div>
                         <input type="radio" name="device" value="laptop" className="hidden" checked={device === 'laptop'} onChange={() => setDevice('laptop')} />
                         <span className="font-bold">Máy chiếu + Laptop</span>
                     </label>
                     <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${device === 'mobile' ? 'bg-blue-500 border-blue-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'}`}>
                         <div className={`w-5 h-5 rounded flex items-center justify-center border ${device === 'mobile' ? 'bg-white/20 border-white text-white' : 'border-slate-300'}`}>
                             {device === 'mobile' && <Check size={14} />}
                         </div>
                         <input type="radio" name="device" value="mobile" className="hidden" checked={device === 'mobile'} onChange={() => setDevice('mobile')} />
                         <span className="font-bold">Chỉ có điện thoại</span>
                     </label>
                 </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                 <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${internet === 'no' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'}`}>
                     <div className={`w-5 h-5 rounded flex items-center justify-center border ${internet === 'no' ? 'bg-white/20 border-white text-white' : 'border-slate-300'}`}>
                         {internet === 'no' && <Check size={14} />}
                     </div>
                     <input type="radio" name="internet" value="no" className="hidden" checked={internet === 'no'} onChange={() => setInternet('no')} />
                     <span className="font-bold">Không có internet</span>
                 </label>
                 <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${internet === 'yes' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'}`}>
                     <div className={`w-5 h-5 rounded flex items-center justify-center border ${internet === 'yes' ? 'bg-white/20 border-white text-white' : 'border-slate-300'}`}>
                         {internet === 'yes' && <Check size={14} />}
                     </div>
                     <input type="radio" name="internet" value="yes" className="hidden" checked={internet === 'yes'} onChange={() => setInternet('yes')} />
                     <span className="font-bold">Có internet ổn định</span>
                 </label>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
            <button className="w-full bg-white border-2 border-teal-600 text-teal-700 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-sm hover:bg-teal-50 transition-colors">
                <Search size={22} /> Tìm kiếm thư viện
            </button>
            <button 
                onClick={handleGenerate}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-md transition-all transform hover:scale-[1.02] hover:shadow-lg"
            >
                <Sparkles size={22} /> Tạo mô phỏng AI 
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2 uppercase tracking-widest">Beta</span>
            </button>
        </div>
      </main>
    </div>
  );
}
