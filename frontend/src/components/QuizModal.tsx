import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Question } from '../data/lessons';

interface QuizModalProps {
  questions: Question[];
  onClose: () => void;
  onSubmit: (answers: Record<number, number>) => void;
  isSubmitting: boolean;
  error?: string | null;
}

const QuizModal: React.FC<QuizModalProps> = ({ questions, onClose, onSubmit, isSubmitting, error }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const question = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = answers[question.id] !== undefined;

  const handleSelectOption = (index: number) => {
    setAnswers(prev => ({ ...prev, [question.id]: index }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(answers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#222] flex justify-between items-center bg-gray-50 dark:bg-[#151515]">
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">Knowledge Check</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:text-[#777] dark:hover:text-white transition-colors cursor-pointer p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100 dark:bg-[#222]">
          <div 
            className="h-full bg-indigo-600 dark:bg-[#676fff] transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="p-6 sm:p-8 flex-1">
          <div className="mb-6">
            <span className="text-xs font-bold text-indigo-600 dark:text-[#676fff] uppercase tracking-wider mb-1.5 block">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">{question.text}</h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left px-5 py-3.5 sm:py-4 rounded-xl border text-sm transition-all cursor-pointer ${
                  answers[question.id] === idx 
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-[#676fff]/10 text-indigo-950 dark:text-white font-medium ring-1 ring-indigo-500' 
                    : 'border-gray-200 dark:border-[#262626] hover:border-gray-300 dark:hover:border-[#444] text-slate-700 dark:text-[#8892b0] hover:text-slate-950 dark:hover:text-white bg-white dark:bg-[#151515]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer with clean flex alignment */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-[#222] bg-gray-50/80 dark:bg-[#151515] flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-[#777] leading-tight flex-1 max-w-[280px]">
            Score 80%+ to unlock the next module.
          </p>
          <button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent || isSubmitting}
            className="bg-[#676fff] hover:bg-[#5560ee] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
          >
            {isSubmitting ? 'Grading...' : isLastQuestion ? 'Submit Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
