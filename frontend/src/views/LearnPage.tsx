import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import WalletBadge from '../components/WalletBadge';
import LessonCard from '../components/LessonCard';
import { lessons } from '../data/lessons';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ProgressRecord {
  lesson_id: number;
  status: string;
  score: number;
}

const LearnPage = () => {
  const { authenticated, ready, getAccessToken } = useAuth();
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [_loading, setLoading] = useState(true);

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
          .filter(r => r.status === 'completed' && r.score >= 75)
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

  if (!ready) return <div className="flex h-screen w-full bg-[#0a0a0a]" />;
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="w-full border-b border-[#222] px-8 py-4 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-[#8892b0] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-[1px] bg-[#222]" />
          <span className="font-bold text-lg tracking-tight">ARCademy Learning Path</span>
        </div>
        <div className="flex items-center gap-4">
          <WalletBadge />
        </div>
      </nav>

      {/* Hero / Progress Overview Header */}
      <header className="max-w-6xl mx-auto px-8 pt-10 pb-6">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold text-[#676fff] uppercase tracking-wider mb-2 block">Curriculum Overview</span>
            <h1 className="text-3xl font-bold mb-2">Mastering Arc L1 & Web3 Development</h1>
            <p className="text-[#8892b0] text-sm max-w-xl">
              Complete each theoretical module and pass the quiz to unlock the next lesson.
            </p>
          </div>
          <div className="bg-[#151515] border border-[#222] rounded-xl p-5 min-w-[240px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-[#777]">Path Progress</span>
              <span className="text-sm font-bold text-[#676fff]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-[#676fff] transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-[#555]">
              {completedCount} of {lessons.length} Modules Completed
            </p>
          </div>
        </div>
      </header>

      {/* Grid of Lessons */}
      <main className="max-w-6xl mx-auto px-8 py-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
