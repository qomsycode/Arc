import React from 'react';
import { X, Award, CheckCircle2 } from 'lucide-react';

interface QuizResultsScreenProps {
  score: number;
  totalQuestions: number;
  onClose: () => void;
  onRetry: () => void;
  onClaim: () => void;
  isClaiming: boolean;
}

const QuizResultsScreen: React.FC<QuizResultsScreenProps> = ({
  score,
  totalQuestions,
  onClose,
  onRetry,
  onClaim,
  isClaiming
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 75;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden flex flex-col relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#777] hover:text-white transition-colors cursor-pointer">
          <X size={20} />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          {passed ? (
            <>
              <div className="w-16 h-16 rounded-full bg-[#676fff]/20 border border-[#676fff]/30 flex items-center justify-center mb-6 text-[#676fff]">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Module Mastered!</h2>
              <p className="text-[#8892b0] text-sm mb-6">
                You scored {score}/{totalQuestions} ({percentage}%). Next module unlocked!
              </p>
              
              <div className="w-full bg-[#151515] border border-[#222] rounded-xl p-4 mb-6 flex items-center justify-center gap-3">
                <Award size={20} className="text-[#676fff]" />
                <span className="text-sm font-semibold text-white">+50 XP • Knowledge Verified</span>
              </div>

              <button
                onClick={onClaim}
                disabled={isClaiming}
                className="w-full bg-[#676fff] hover:bg-[#5560ee] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isClaiming ? 'Loading...' : 'Continue to Next Module'}
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-500 font-bold text-2xl">
                !
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Not Quite There</h2>
              <p className="text-[#8892b0] text-sm mb-8">
                You scored {score}/{totalQuestions} ({percentage}%). You need 75% or higher to unlock the next module.
              </p>
              
              <button
                onClick={onRetry}
                className="w-full bg-[#222] hover:bg-[#333] text-white font-semibold py-3.5 rounded-xl transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResultsScreen;
