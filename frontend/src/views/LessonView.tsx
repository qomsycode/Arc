import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lessons } from '../data/lessons';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, BookOpen, Clock, Lock } from 'lucide-react';
import WalletBadge from '../components/WalletBadge';
import QuizModal from '../components/QuizModal';
import QuizResultsScreen from '../components/QuizResultsScreen';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const LessonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authenticated, ready, getAccessToken } = useAuth();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [checkingProgress, setCheckingProgress] = useState(true);

  const lesson = lessons.find(l => l.id === Number(id));

  useEffect(() => {
    const checkLockStatus = async () => {
      if (!authenticated || !lesson) return;
      if (lesson.id === 1) {
        setIsLocked(false);
        setCheckingProgress(false);
        return;
      }

      try {
        const token = await getAccessToken();
        const res = await axios.get(`${backendUrl}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const records = res.data.progress || [];
        const isPrevCompleted = records.some((r: any) => r.lesson_id === lesson.id - 1 && r.status === 'completed' && r.score >= 75);
        if (!isPrevCompleted) {
          setIsLocked(true);
        }
      } catch (err) {
        console.error('Error checking lock status:', err);
      } finally {
        setCheckingProgress(false);
      }
    };

    checkLockStatus();
  }, [authenticated, lesson?.id]);

  if (!ready) return <div className="flex h-screen w-full bg-[#0a0a0a]" />;
  if (!authenticated) return <Navigate to="/login" replace />;
  if (!lesson) return <Navigate to="/learn" replace />;

  if (checkingProgress) {
    return <div className="flex h-screen w-full bg-[#0a0a0a]" />;
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#151515] border border-[#222] flex items-center justify-center mb-6 text-[#676fff]">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Lesson Locked</h1>
        <p className="text-[#8892b0] max-w-md mb-6 text-sm">
          You must complete and pass the quiz for Lesson {lesson.id - 1} before accessing this lesson.
        </p>
        <Link 
          to="/learn" 
          className="bg-[#676fff] hover:bg-[#5560ee] text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Return to Learning Path
        </Link>
      </div>
    );
  }

  const handleQuizSubmit = async (answers: Record<number, number>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const token = await getAccessToken();
      
      const res = await axios.post(`${backendUrl}/api/quiz/grade`, {
        lessonId: lesson.id,
        answers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const { score, passed } = res.data;
      setQuizScore(score);
      setShowQuiz(false);
      setShowResults(true);

    } catch (error: any) {
      console.error('Failed to submit quiz', error);
      setSubmitError(error.response?.data?.error || error.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      setShowResults(false);
      navigate('/learn');
    } catch (error) {
      console.error('Failed to claim', error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="w-full border-b border-[#222] px-6 py-4 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link to="/learn" className="text-[#8892b0] hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#555]">Lesson {lesson.id}:</span>
            <span className="font-bold text-white">{lesson.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <WalletBadge />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 pb-8 border-b border-[#222]">
          <span className="text-xs font-bold text-[#676fff] uppercase tracking-wider block mb-2">Module {lesson.id}</span>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">{lesson.title}</h1>
          <div className="flex gap-6 text-[#777] text-sm">
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>{lesson.questions.length} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>~8 mins read</span>
            </div>
          </div>
        </div>

        {/* Beautiful Styled Markdown Content */}
        <div className="mb-20">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-white mt-12 mb-6 pb-3 border-b border-[#222] tracking-tight">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-white mt-10 mb-5 pb-2 border-b border-[#222] tracking-tight">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-[#676fff] mt-8 mb-4 tracking-tight">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-[#94a3b8] text-base leading-8 mb-6 font-normal">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-6 text-[#94a3b8] mb-6 space-y-2 leading-relaxed">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-6 text-[#94a3b8] mb-6 space-y-2 leading-relaxed">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-[#94a3b8] text-base leading-7 pl-1">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-white">{children}</strong>
              ),
              hr: () => (
                <hr className="border-[#222] my-10" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#676fff] bg-[#151515] p-5 my-6 rounded-r-xl text-[#cbd5e1] italic leading-7">
                  {children}
                </blockquote>
              ),
              code: ({ className, children, ...props }) => {
                const isBlock = className || (typeof children === 'string' && children.includes('\n'));
                return isBlock ? (
                  <pre className="bg-[#111] border border-[#222] rounded-xl p-5 overflow-x-auto my-6 text-sm font-mono text-[#cbd5e1] leading-relaxed">
                    <code>{children}</code>
                  </pre>
                ) : (
                  <code className="bg-[#1a1a1a] text-[#676fff] px-2 py-0.5 rounded text-sm font-mono border border-[#2a2a2a]">
                    {children}
                  </code>
                );
              },
              table: ({ children }) => (
                <div className="overflow-x-auto my-8 border border-[#222] rounded-xl">
                  <table className="w-full text-left border-collapse bg-[#111]">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-[#151515] p-4 border-b border-[#222] font-semibold text-white text-sm">{children}</th>
              ),
              td: ({ children }) => (
                <td className="p-4 border-b border-[#222] text-[#94a3b8] text-sm">{children}</td>
              ),
              img: ({ src, alt }) => (
                <img src={src} alt={alt} className="rounded-2xl border border-[#222] my-8 max-h-96 w-full object-cover shadow-2xl" />
              )
            }}
          >
            {lesson.content}
          </ReactMarkdown>
        </div>

        {/* Action Bottom */}
        <div className="border-t border-[#222] pt-8 flex justify-between items-center bg-[#111] border border-[#222] p-8 rounded-2xl">
          <div>
            <h3 className="font-bold text-lg mb-1">Ready to test your knowledge?</h3>
            <p className="text-[#777] text-sm">Pass the quiz with 75% or higher to unlock the next lesson.</p>
          </div>
          <button 
            onClick={() => setShowQuiz(true)}
            className="bg-[#676fff] hover:bg-[#5560ee] text-white font-medium px-8 py-3.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Take Quiz
          </button>
        </div>
      </main>

      {/* Modals */}
      {showQuiz && (
        <QuizModal 
          questions={lesson.questions} 
          onClose={() => setShowQuiz(false)} 
          onSubmit={handleQuizSubmit}
          isSubmitting={isSubmitting}
          error={submitError}
        />
      )}

      {showResults && (
        <QuizResultsScreen 
          score={quizScore} 
          totalQuestions={lesson.questions.length} 
          onClose={() => setShowResults(false)}
          onRetry={() => {
            setShowResults(false);
            setShowQuiz(true);
          }}
          onClaim={handleClaim}
          isClaiming={isClaiming}
        />
      )}
    </div>
  );
};

export default LessonView;
