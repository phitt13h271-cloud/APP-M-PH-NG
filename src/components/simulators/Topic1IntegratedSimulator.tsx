import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, MoveRight, HelpCircle, ArrowRight, MessageCircle, Bot, Send, Key } from 'lucide-react';
import { HardwareSoftwareSim } from './HardwareSoftwareSim';
import { TypingSim } from './TypingSim';

export const Topic1IntegratedSimulator: React.FC = () => {
    const [apiKey, setApiKey] = useState('');
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'hw' | 'typing'>('hw');
    
    useEffect(() => {
        const saved = localStorage.getItem('gemini_api_key');
        if (saved) setApiKey(saved);
        else setShowKeyModal(true);
    }, []);

    const saveKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
        setShowKeyModal(false);
    };

    return (
        <div className="w-full h-full min-h-[600px] flex flex-col bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden font-sans text-slate-100">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between shrink-0 shadow-md z-10">
                 <div className="flex space-x-2">
                     <button 
                        onClick={() => setActiveTab('hw')} 
                        className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'hw' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                     >
                        Phần cứng & Phần mềm
                     </button>
                     <button 
                        onClick={() => setActiveTab('typing')} 
                        className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'typing' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                     >
                        Luyện Gõ Phím
                     </button>
                 </div>
                 <button onClick={() => setShowKeyModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium transition-colors border border-slate-600">
                     <Key size={16} className={apiKey ? "text-green-400" : "text-amber-400"} />
                     {apiKey ? "Đã cài đặt API" : "Cấu hình API Key"}
                 </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden flex">
                {activeTab === 'hw' ? <HardwareSoftwareSim apiKey={apiKey} /> : <TypingSim apiKey={apiKey} />}
            </div>

            {/* API Key Modal */}
            {showKeyModal && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full mb-4 self-center">
                            <Bot size={24} />
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-center text-white">Kết nối Trợ lý AI Gemini</h2>
                        <p className="text-sm text-slate-400 mb-6 text-center leading-relaxed">
                            Ứng dụng cần sử dụng Gemini API để phân tích và hỗ trợ tự động trong quá trình mô phỏng. API Key sẽ được lưu ở trình duyệt của bạn.
                        </p>
                        
                        <input 
                            type="password"
                            placeholder="Nhập Google Gemini API Key (AIzaSy...)"
                            className="w-full bg-slate-900 border border-slate-600 text-white px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-6 font-mono text-sm"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        
                        <div className="flex gap-3">
                            <button onClick={() => setShowKeyModal(false)} className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors">
                                Quét qua
                            </button>
                            <button onClick={() => saveKey(apiKey)} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-500/20">
                                Lưu Kết nối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
