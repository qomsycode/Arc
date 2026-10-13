import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Lesson } from '../data/lessons';

interface LessonCardProps {
  lesson: Lesson;
  status: 'locked' | 'active' | 'completed';
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, status }) => {
  const isLocked = status === 'locked';
  
  return (
    <div className={`relative bg-white dark:bg-[#111] border rounded-2xl p-6 transition-all duration-200 shadow-xs dark:shadow-none ${
      isLocked 
        ? 'border-gray-200 dark:border-[#222] opacity-60' 
        : 'border-gray-200 dark:border-[#222] hover:border-indigo-300 dark:hover:border-[#444] card-hover-effect'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            status === 'completed' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
              : isLocked 
                ? 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 dark:text-[#444]' 
                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#676fff]'
          }`}>
            {status === 'completed' ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={20} /> : <PlayCircle size={20} />}
          </div>
          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold text-base">{lesson.title}</h3>
            <span className="text-xs text-slate-500 dark:text-[#777]">Module {lesson.id}</span>
          </div>
        </div>
        
        {/* XP Badge */}
        {!isLocked && (
          <div className="bg-indigo-50 dark:bg-[#1a1a1a] border border-indigo-100 dark:border-[#222] rounded-full px-3 py-1 text-xs font-bold text-indigo-600 dark:text-[#676fff]">
            +50 XP
          </div>
        )}
      </div>
      
      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-[#8892b0] mb-6 leading-relaxed">
        {lesson.description}
      </p>
      
      {/* Action Button */}
      {isLocked ? (
        <button disabled className="w-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 dark:text-[#555] font-medium text-sm py-2.5 rounded-xl cursor-not-allowed">
          Locked (Pass Previous Module)
        </button>
      ) : (
        <Link to={`/learn/${lesson.id}`} className="block">
          <button className={`w-full font-medium text-sm py-2.5 rounded-xl transition-colors cursor-pointer ${
            status === 'completed' 
              ? 'bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-slate-800 dark:text-white' 
              : 'bg-[#676fff] hover:bg-[#5560ee] text-white shadow-sm'
          }`}>
            {status === 'completed' ? 'Review Module & Quiz' : 'Start Lesson'}
          </button>
        </Link>
      )}
    </div>
  );
};

export default LessonCard;
