import React from 'react';
import { courseData } from '../../data/courseData';
import { Topic, Lesson } from '../../types';
import { MonitorPlay } from 'lucide-react';

interface SidebarProps {
  activeTopicId: string;
  activeLessonId: string;
  onSelectLesson: (topicId: string, lessonId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTopicId, activeLessonId, onSelectLesson }) => {
  return (
    <div className="w-80 h-full bg-slate-900 border-r border-white/10 flex flex-col overflow-y-auto custom-scrollbar shadow-2xl relative">
      <div className="p-6 pb-4 sticky top-0 bg-slate-900/95 z-20 border-b border-white/5 backdrop-blur-md">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight leading-snug">
          Mô phỏng Trực quan<br/><span className="text-sm tracking-widest text-slate-400 uppercase">Tin Học Lớp 4</span>
        </h1>
      </div>
      
      <div className="flex-1 p-4 space-y-8">
        {courseData.map((topic: Topic) => (
          <div key={topic.id} className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 pl-2">
              {topic.title}
            </h3>
            
            <div className="space-y-1">
              {topic.lessons.map((lesson: Lesson) => {
                const isActive = lesson.id === activeLessonId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(topic.id, lesson.id)}
                    className={`w-full flex items-start p-3 rounded-xl transition-all duration-300 text-left ${
                      isActive 
                        ? 'bg-blue-600/20 border border-blue-500/40 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <MonitorPlay size={18} className={`mt-0.5 flex-shrink-0 mr-3 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                    <span className={`text-sm font-medium leading-relaxed ${isActive ? 'text-blue-100 font-bold' : 'text-slate-300'}`}>
                      {lesson.title.replace('Bài ', 'B.')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
