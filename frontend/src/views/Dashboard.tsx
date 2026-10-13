import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import WalletBadge from '../components/WalletBadge';
import ThemeToggle from '../components/ThemeToggle';
import { lessons } from '../data/lessons';
import { 
  BookOpen, 
  Code2, 
  Award, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  Flame,
  Activity,
  Bot
} from 'lucide-react';

const Dashboard = () => {
  const { authenticated, ready, logout, getAccessToken, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({ 
    progressPercent: 0, 
    completedCount: 0,
    challengesPassed: 0, 
    totalXp: 0,
    nextLesson: lessons[0]
  });

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

        const completedRecords = (resProgress.progress || []).filter((r: any) => r.status === 'completed' && r.score >= 80);
        const completedCount = completedRecords.length;
        const progressPercent = Math.round((completedCount / lessons.length) * 100);

        // Find next unfinished lesson
        const completedIds = new Set(completedRecords.map((r: any) => r.lesson_id));
        const next = lessons.find(l => !completedIds.has(l.id)) || lessons[lessons.length - 1];

        const resSubs = await fetch(`${backendUrl}/api/submissions/my`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json());

        const challengesPassed = (resSubs.submissions || []).filter((s: any) => s.status === 'approved').length;
        const totalXp = profile?.xp_points || (completedCount * 50);

        setStats({ 
          progressPercent, 
          completedCount,
          challengesPassed, 
          totalXp,
          nextLesson: next
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };

    fetchDashboardStats();
  }, [authenticated, profile]);

  if (!ready || !authenticated) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors">
      {/* Top Navigation */}
      <header className="border-b border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0e0e0e] px-3 sm:px-10 py-2.5 sm:py-3.5 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#676fff] flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-sm shrink-0">
              A
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                ARCademy
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Arc Mainnet
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeToggle />
            <WalletBadge />
            <button
              onClick={logout}
              className="text-[11px] sm:text-sm font-medium text-slate-600 dark:text-[#777] hover:text-slate-900 dark:hover:text-white border border-gray-200 dark:border-[#1a1a1a] hover:border-gray-300 dark:hover:border-[#333] bg-white dark:bg-[#111] px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-colors cursor-pointer shadow-sm dark:shadow-none whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-10 py-8 sm:py-10">
        
        {/* Welcome & Motivational Headline Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200 dark:border-[#1a1a1a]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-[#676fff] mb-1.5">
              <Sparkles size={14} />
              <span>Interactive Learning Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, Builder
            </h1>
            <p className="text-slate-500 dark:text-[#666] text-sm mt-1">
              Master Arc L1 protocols, pass quizzes to earn on-chain rewards, and solve bounties.
            </p>
          </div>

          {/* Network Pulse Mini-Badge */}
          <div className="flex items-center gap-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] px-3.5 py-2 rounded-xl text-xs text-slate-600 dark:text-[#888] shadow-sm dark:shadow-none self-start md:self-auto">
            <Activity size={14} className="text-emerald-500" />
            <span>Block Finality: <strong className="text-slate-900 dark:text-white">&lt;800ms</strong></span>
            <span className="text-gray-300 dark:text-[#222]">|</span>
            <span>Fee: <strong className="text-slate-900 dark:text-white">&lt;$0.0001</strong></span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-[#555] uppercase tracking-wider">Course Progress</p>
              <BookOpen size={16} className="text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.progressPercent}%</span>
              <span className="text-xs text-slate-500 dark:text-[#555]">({stats.completedCount}/{lessons.length} Modules)</span>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-100 dark:bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 dark:bg-[#676fff] h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.progressPercent}%` }} 
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-[#555] uppercase tracking-wider">Challenges Passed</p>
              <Award size={16} className="text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.challengesPassed}</span>
              <span className="text-xs text-slate-500 dark:text-[#555]">Approved Bounties</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#555]">Submit repos on the Build page for review</p>
          </div>

          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-[#555] uppercase tracking-wider">Reputation & XP</p>
              <Flame size={16} className="text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-indigo-600 dark:text-[#676fff]">{stats.totalXp}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-[#555]">XP</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#555]">+50 XP per passed 80%+ module</p>
          </div>
        </div>

        {/* Hero Interactive "Up Next" Card */}
        <div className="mb-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-[#676fff] bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md">
                <ArrowRight size={13} />
                <span>Next Up in Curriculum</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Lesson {stats.nextLesson.id}: {stats.nextLesson.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#777] leading-relaxed">
                {stats.nextLesson.description}
              </p>
            </div>

            <Link 
              to={`/learn/${stats.nextLesson.id}`}
              className="inline-flex items-center gap-2 bg-[#676fff] hover:bg-[#5560ee] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors shrink-0 shadow-sm"
            >
              <span>Continue Lesson</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Action Pathways: Learn vs Build vs Copilot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Link to="/learn" className="block group">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] group-hover:border-indigo-300 dark:group-hover:border-[#333] transition-all rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#181818] border border-indigo-100 dark:border-[#222] text-indigo-600 dark:text-[#676fff] flex items-center justify-center mb-4">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>Learning Center</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 dark:text-[#676fff]" />
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#777] leading-relaxed mb-4">
                  Ten hands-on modules covering EVM compatibility, stablecoin architecture, embedded wallets, and smart contract escrow.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#555] pt-4 border-t border-gray-100 dark:border-[#1a1a1a] flex-wrap">
                <span>10 Modules</span>
                <span>•</span>
                <span>80% Pass</span>
                <span>•</span>
                <span>USDC Rewards</span>
              </div>
            </div>
          </Link>

          <Link to="/build" className="block group">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] group-hover:border-emerald-300 dark:group-hover:border-[#333] transition-all rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#181818] border border-emerald-100 dark:border-[#222] text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <Code2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>Build Challenges</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-emerald-400" />
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#777] leading-relaxed mb-4">
                  Real-world coding assignments. Fork our starter repos, build decentralized tools, and submit PRs for reviewer validation.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#555] pt-4 border-t border-gray-100 dark:border-[#1a1a1a] flex-wrap">
                <span>5 Real Projects</span>
                <span>•</span>
                <span>Code Reviews</span>
                <span>•</span>
                <span>USDC Grants</span>
              </div>
            </div>
          </Link>

          <Link to="/copilot" className="block group">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] group-hover:border-purple-300 dark:group-hover:border-[#333] transition-all rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#181818] border border-purple-100 dark:border-[#222] text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                  <Bot size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>Arc Copilot (AI)</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 dark:text-purple-400" />
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#777] leading-relaxed mb-4">
                  AI Architecture Assistant. Generate Arc-compatible smart contracts, configure Hardhat scripts, and audit Solidity code.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#555] pt-4 border-t border-gray-100 dark:border-[#1a1a1a] flex-wrap">
                <span>Solidity Generator</span>
                <span>•</span>
                <span>USDC Precompile</span>
                <span>•</span>
                <span>Instant AI</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Useful Arc Developer Resources Section */}
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-2xl p-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-[#666]">
              Developer Fast Links
            </h3>
            <span className="text-xs text-slate-400 dark:text-[#444]">Arc Ecosystem</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a 
              href="https://explorer.arc.network" 
              target="_blank" 
              rel="noreferrer" 
              className="p-3.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-indigo-300 dark:hover:border-[#333] flex items-center justify-between text-xs font-medium text-slate-700 dark:text-[#888] hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Arc Block Explorer</span>
              <ExternalLink size={14} />
            </a>
            <a 
              href="https://docs.arc.network" 
              target="_blank" 
              rel="noreferrer" 
              className="p-3.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-indigo-300 dark:hover:border-[#333] flex items-center justify-between text-xs font-medium text-slate-700 dark:text-[#888] hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Official Protocol Docs</span>
              <ExternalLink size={14} />
            </a>
            <a 
              href="https://faucet.arc.network" 
              target="_blank" 
              rel="noreferrer" 
              className="p-3.5 rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-indigo-300 dark:hover:border-[#333] flex items-center justify-between text-xs font-medium text-slate-700 dark:text-[#888] hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Testnet Gas Faucet</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
