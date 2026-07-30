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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex justify-between items-center bg-[#151515]">
          <h2 className="font-semibold text-white">Knowledge Check</h2>
          <button onClick={onClose} className="text-[#777] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#222]">
          <div 
            className="h-full bg-[#676fff] transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="p-8 flex-1">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#676fff] uppercase tracking-wider mb-2 block">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <h3 className="text-xl font-medium text-white">{question.text}</h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  answers[question.id] === idx 
                    ? 'border-[#676fff] bg-[#676fff]/10 text-white' 
                    : 'border-[#333] hover:border-[#555] text-[#8892b0] hover:text-white bg-[#151515]'
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

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#222] bg-[#151515] flex justify-between items-center">
          <p className="text-xs text-[#555]">
            Complete all questions to verify your knowledge and unlock the next module.
          </p>
          <button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent || isSubmitting}
            className="bg-[#676fff] hover:bg-[#5560ee] text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Grading...' : isLastQuestion ? 'Submit Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
