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
    <div className={`relative bg-[#111] border rounded-2xl p-6 transition-all duration-300 ${isLocked ? 'border-[#222] opacity-60' : 'border-[#333] hover:border-[#676fff]'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status === 'completed' ? 'bg-[#3cd876]/10 text-[#3cd876]' : isLocked ? 'bg-[#222] text-[#555]' : 'bg-[#676fff]/10 text-[#676fff]'}`}>
            {status === 'completed' ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={20} /> : <PlayCircle size={20} />}
          </div>
          <div>
            <h3 className="text-white font-semibold">{lesson.title}</h3>
            <span className="text-xs text-[#777]">Lesson {lesson.id}</span>
          </div>
        </div>
        
        {/* XP Badge */}
        {!isLocked && (
          <div className="bg-[#181c28] border border-[#1e2436] rounded-full px-3 py-1 text-xs font-bold text-[#676fff]">
            +50 XP
          </div>
        )}
      </div>
      
      {/* Description */}
      <p className="text-sm text-[#8892b0] mb-6 leading-relaxed">
        {lesson.description}
      </p>
      
      {/* Action Button */}
      {isLocked ? (
        <button disabled className="w-full bg-[#222] text-[#555] font-medium text-sm py-2.5 rounded-xl cursor-not-allowed">
          Locked
        </button>
      ) : (
        <Link to={`/learn/${lesson.id}`} className="block">
          <button className={`w-full font-medium text-sm py-2.5 rounded-xl transition-colors cursor-pointer ${status === 'completed' ? 'bg-[#222] hover:bg-[#333] text-white' : 'bg-[#676fff] hover:bg-[#5560ee] text-white'}`}>
            {status === 'completed' ? 'Review Lesson' : 'Start Lesson'}
          </button>
        </Link>
      )}
    </div>
  );
};

export default LessonCard;
