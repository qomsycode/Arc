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
        
        // Fetch progress
        const resProgress = await fetch(`${backendUrl}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());
        
        const completedCount = (resProgress.progress || []).filter((r: any) => r.status === 'completed' && r.score >= 75).length;
        const progressPercent = Math.round((completedCount / 10) * 100);

        // Fetch submissions
        const resSubs = await fetch(`${backendUrl}/api/submissions/my`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());

        const approvedSubs = (resSubs.submissions || []).filter((s: any) => s.status === 'approved');
        const challengesPassed = approvedSubs.length;

        // Calculate XP (50 XP per passed module)
        const totalXp = completedCount * 50;

        setStats({
          progressPercent,
          challengesPassed,
          totalXp
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchDashboardStats();
  }, [authenticated]);

  if (!ready || !authenticated) return null;

  return (
    <div className="min-h-screen bg-[#08090c] text-[#f0f2ff]">
      {/* Header */}
      <header className="border-b border-[#1e2436] px-12 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#676fff] to-[#9b59b6] flex items-center justify-center text-white font-black text-sm">
              A
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#f0f2ff] to-[#676fff] bg-clip-text text-transparent">
              ARCademy
            </span>
          </div>
          <div className="flex items-center gap-4">
            <WalletBadge />
            <button
              onClick={logout}
              className="text-sm font-medium text-[#8892b0] hover:text-[#f0f2ff] bg-[#10121a] border border-[#1e2436] hover:border-[#676fff] px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-12 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
          <p className="text-[#8892b0] text-sm">Welcome back! Here is your progress at a glance.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <div className="bg-[#10121a] border border-[#1e2436] hover:border-[#676fff] rounded-xl p-7 transition-all duration-200 hover:shadow-lg hover:shadow-[#676fff]/10 group">
            <p className="text-xs font-semibold text-[#4a5580] uppercase tracking-widest mb-3">Learning Progress</p>
            <p className="text-4xl font-bold text-[#f0f2ff]">{stats.progressPercent}<span className="text-2xl text-[#8892b0]">%</span></p>
          </div>
          <div className="bg-[#10121a] border border-[#1e2436] hover:border-[#676fff] rounded-xl p-7 transition-all duration-200 hover:shadow-lg hover:shadow-[#676fff]/10 group">
            <p className="text-xs font-semibold text-[#4a5580] uppercase tracking-widest mb-3">Challenges Passed</p>
            <p className="text-4xl font-bold text-[#f0f2ff]">{stats.challengesPassed}</p>
          </div>
          <div className="bg-[#10121a] border border-[#1e2436] hover:border-[#676fff] rounded-xl p-7 transition-all duration-200 hover:shadow-lg hover:shadow-[#676fff]/10 group">
            <p className="text-xs font-semibold text-[#4a5580] uppercase tracking-widest mb-3">Total XP Earned</p>
            <p className="text-4xl font-bold text-[#676fff]">{stats.totalXp} <span className="text-2xl text-[#8892b0]">XP</span></p>
          </div>
        </div>

        {/* Actions panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link to="/learn" className="block">
            <div className="bg-[#10121a] border border-[#1e2436] hover:border-[#676fff] hover:bg-[#1a1d29] transition-all duration-200 rounded-xl p-7 cursor-pointer h-full">
              <h3 className="font-semibold text-[#f0f2ff] mb-2">📚 Learning Center</h3>
              <p className="text-sm text-[#8892b0]">Structured Arc L1 blockchain courses to level up your skills.</p>
            </div>
          </Link>
          <Link to="/build" className="block">
            <div className="bg-[#10121a] border border-[#1e2436] hover:border-[#3cd876] hover:bg-[#1a1d29] transition-all duration-200 rounded-xl p-7 cursor-pointer h-full">
              <h3 className="font-semibold text-[#f0f2ff] mb-2">🛠️ Build Challenges</h3>
              <p className="text-sm text-[#8892b0]">Real coding challenges to sharpen your Arc L1 skills.</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
