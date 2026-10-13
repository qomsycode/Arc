import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import WalletBadge from '../components/WalletBadge';
import LessonCard from '../components/LessonCard';
import ThemeToggle from '../components/ThemeToggle';
import { lessons } from '../data/lessons';
import { ArrowLeft, BookOpen } from 'lucide-react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ProgressRecord {
  lesson_id: number;
  status: string;
  score: number;
}

const LearnPage = () => {
  const { authenticated, ready, getAccessToken, refreshProfile } = useAuth();
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    if (authenticated) {
      refreshProfile();
    }
  }, [authenticated]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!authenticated) return;
      try {
        const token = await getAccessToken();
        const res = await axios.get(`${backendUrl}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const records: ProgressRecord[] = res.data.progress || [];
        const completed = records
          .filter(r => r.status === 'completed' && r.score >= 80)
          .map(r => r.lesson_id);
        setCompletedLessonIds(completed);
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [authenticated]);

  if (!ready) return <div className="flex h-screen w-full bg-[#fafafa] dark:bg-[#0a0a0a]" />;
  if (!authenticated) return <Navigate to="/login" replace />;

  const getLessonStatus = (lessonId: number): 'locked' | 'active' | 'completed' => {
    if (completedLessonIds.includes(lessonId)) {
      return 'completed';
    }
    // Lesson 1 is always unlocked
    if (lessonId === 1) {
      return 'active';
    }
    // Lesson N is unlocked if Lesson N-1 is completed
    if (completedLessonIds.includes(lessonId - 1)) {
      return 'active';
    }
    return 'locked';
  };

  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors">
      {/* Top Navbar */}
      <nav className="w-full border-b border-gray-200 dark:border-[#1a1a1a] px-4 sm:px-8 py-3.5 flex justify-between items-center bg-white dark:bg-[#0e0e0e] sticky top-0 z-10 gap-2">
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <Link to="/dashboard" className="text-slate-500 dark:text-[#8892b0] hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium shrink-0">
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-[1px] bg-gray-200 dark:bg-[#222] hidden sm:block" />
          <span className="font-bold text-xs sm:text-lg tracking-tight truncate hidden sm:inline text-slate-900 dark:text-white">
            ARCademy Curriculum
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />
          <WalletBadge />
        </div>
      </nav>

      {/* Hero / Progress Overview Header */}
      <header className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 pb-4">
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm dark:shadow-none">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-[#676fff] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen size={14} />
              <span>Full Curriculum</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">
              Mastering Arc L1 &amp; Web3 Architecture
            </h1>
            <p className="text-slate-600 dark:text-[#8892b0] text-sm max-w-xl leading-relaxed">
              Complete each theoretical module and score 80% or above on quizzes to unlock rewards and next lessons.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-[#222] rounded-xl p-5 min-w-[240px] w-full md:w-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-[#777]">Path Completion</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-[#676fff]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-[#222] rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-indigo-600 dark:bg-[#676fff] transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-[#555]">
              {completedCount} of {lessons.length} Modules Completed
            </p>
          </div>
        </div>
      </header>

      {/* Grid of Lessons */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {lessons.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            return (
              <LessonCard 
                key={lesson.id} 
                lesson={lesson} 
                status={status} 
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
