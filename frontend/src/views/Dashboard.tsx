import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import WalletBadge from '../components/WalletBadge';

const Dashboard = () => {
  const { authenticated, ready, logout, getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({ progressPercent: 0, challengesPassed: 0, totalXp: 0 });

  React.useEffect(() => {
    if (ready && !authenticated) {
      navigate('/login');
    }
  }, [ready, authenticated, navigate]);

  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!authenticated) return;
      try {
        const token = await getAccessToken();
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

        const resProgress = await fetch(`${backendUrl}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());

        const completedCount = (resProgress.progress || []).filter((r: any) => r.status === 'completed' && r.score >= 80).length;
        const progressPercent = Math.round((completedCount / 10) * 100);

        const resSubs = await fetch(`${backendUrl}/api/submissions/my`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());

        const challengesPassed = (resSubs.submissions || []).filter((s: any) => s.status === 'approved').length;
        const totalXp = completedCount * 50;

        setStats({ progressPercent, challengesPassed, totalXp });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchDashboardStats();
  }, [authenticated]);

  if (!ready || !authenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-4 sm:px-12 py-3 sm:py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#676fff] flex items-center justify-center text-white font-black text-xs sm:text-sm">
              A
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white">
              ARCademy
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <WalletBadge />
            <button
              onClick={logout}
              className="text-xs sm:text-sm font-medium text-[#666] hover:text-white border border-[#1a1a1a] hover:border-[#333] px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-12 py-8 sm:py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
          <p className="text-[#555] text-sm">Welcome back. Here is your progress at a glance.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <p className="text-xs font-semibold text-[#555] uppercase tracking-widest mb-3">Learning Progress</p>
            <p className="text-4xl font-bold text-white">
              {stats.progressPercent}<span className="text-2xl text-[#444]">%</span>
            </p>
          </div>
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <p className="text-xs font-semibold text-[#555] uppercase tracking-widest mb-3">Challenges Passed</p>
            <p className="text-4xl font-bold text-white">{stats.challengesPassed}</p>
          </div>
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-6">
            <p className="text-xs font-semibold text-[#555] uppercase tracking-widest mb-3">Total XP Earned</p>
            <p className="text-4xl font-bold text-white">
              {stats.totalXp} <span className="text-2xl text-[#676fff]">XP</span>
            </p>
          </div>
        </div>

        {/* Action panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/learn" className="block group">
            <div className="bg-[#111] border border-[#1a1a1a] group-hover:border-[#333] transition-colors rounded-xl p-7 h-full">
              <h3 className="font-semibold text-white mb-2">📚 Learning Center</h3>
              <p className="text-sm text-[#555]">Structured Arc L1 blockchain courses to level up your skills.</p>
            </div>
          </Link>
          <Link to="/build" className="block group">
            <div className="bg-[#111] border border-[#1a1a1a] group-hover:border-[#333] transition-colors rounded-xl p-7 h-full">
              <h3 className="font-semibold text-white mb-2">🛠️ Build Challenges</h3>
              <p className="text-sm text-[#555]">Real coding challenges to sharpen your Arc L1 skills.</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
