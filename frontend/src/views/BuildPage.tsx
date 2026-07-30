import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import WalletBadge from '../components/WalletBadge';
import { challenges } from '../data/challenges';
import { ArrowLeft, Award, ExternalLink } from 'lucide-react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Submission {
  id: number;
  challenge_id: number;
  github_url: string;
  live_url?: string;
  status: 'pending' | 'approved' | 'needs_improvement';
  reviewer_feedback?: string;
  submitted_at: string;
}

const BuildPage = () => {
  const { authenticated, ready, profile, getAccessToken } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!authenticated) return;
      try {
        const token = await getAccessToken();
        const res = await axios.get(`${backendUrl}/api/submissions/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error('Error fetching my submissions:', err);
      }
    };

    fetchSubmissions();
  }, [authenticated]);

  if (!ready) return <div className="flex h-screen w-full bg-[#0a0a0a]" />;
  if (!authenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="w-full border-b border-[#222] px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10 gap-2">
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <Link to="/dashboard" className="text-[#8892b0] hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium shrink-0">
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-[1px] bg-[#222] hidden sm:block" />
          <span className="font-bold text-xs sm:text-lg tracking-tight truncate hidden sm:inline">ARCademy Build Bounties</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {(profile?.role === 'admin' || profile?.role === 'reviewer') && (
            <Link to="/admin" className="text-xs text-[#8892b0] hover:text-white border border-[#333] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-colors">
              Admin Portal
            </Link>
          )}
          <WalletBadge />
        </div>
      </nav>

      {/* Hero Header */}
      <header className="max-w-6xl mx-auto px-8 pt-10 pb-6">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs font-bold text-[#3cd876] uppercase tracking-wider mb-2 block flex items-center gap-2">
              <Award size={14} /> Earn USDC Bounties
            </span>
            <h1 className="text-3xl font-bold mb-2">Build Practical Arc L1 Applications</h1>
            <p className="text-[#8892b0] text-sm max-w-xl">
              Put your knowledge to work. Select a build challenge, construct the project, and submit your GitHub link for manual reviewer approval and escrow release.
            </p>
          </div>
          <div className="bg-[#151515] border border-[#222] rounded-xl p-5 min-w-[220px]">
            <span className="text-xs font-medium text-[#777] block mb-1">Total Available Bounties</span>
            <p className="text-3xl font-bold text-[#3cd876]">$235.00 <span className="text-sm font-normal text-[#8892b0]">USDC</span></p>
          </div>
        </div>
      </header>

      {/* User's Submissions List Tracker */}
      {submissions.length > 0 && (
        <section className="max-w-6xl mx-auto px-8 py-4 mb-6">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              📂 My Challenge Submissions
            </h2>
            <div className="space-y-4">
              {submissions.map((sub) => {
                const associatedChallenge = challenges.find((c) => c.id === sub.challenge_id);
                return (
                  <div key={sub.id} className="bg-[#151515] border border-[#222] rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-sm font-bold text-white">
                          {associatedChallenge ? associatedChallenge.title : `Challenge #${sub.challenge_id}`}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          sub.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8892b0] mb-2 font-mono">
                        <span>Submitted GitHub:</span>
                        <a href={sub.github_url} target="_blank" rel="noreferrer" className="text-[#676fff] hover:underline flex items-center gap-0.5">
                          {sub.github_url.replace('https://github.com/', '')}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                      {sub.reviewer_feedback && (
                        <div className="mt-2 p-3 bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg text-xs text-[#8892b0]">
                          <span className="font-bold text-white block mb-0.5">Reviewer Feedback:</span>
                          {sub.reviewer_feedback}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Link
                        to={`/build/${sub.challenge_id}`}
                        className="text-xs text-[#8892b0] hover:text-white border border-[#333] hover:border-[#676fff] px-3.5 py-2 rounded-lg font-medium transition-all"
                      >
                        View Challenge Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Grid of Challenges */}
      <main className="max-w-6xl mx-auto px-8 py-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className="bg-[#111] border border-[#222] hover:border-[#676fff]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-[#8892b0] bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#222]">
                    {challenge.category}
                  </span>
                  <span className="text-xs font-bold text-[#3cd876] bg-[#3cd876]/10 border border-[#3cd876]/20 px-2.5 py-1 rounded-md">
                    ${challenge.bountyAmount.toFixed(2)} USDC
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#676fff] transition-colors">{challenge.title}</h3>
                <p className="text-sm text-[#8892b0] line-clamp-3 mb-6">
                  {challenge.description}
                </p>
              </div>

              <div className="border-t border-[#222] pt-4 flex justify-between items-center">
                <span className={`text-xs font-medium ${
                  challenge.difficulty === 'Beginner' ? 'text-blue-400' :
                  challenge.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-purple-400'
                }`}>
                  ● {challenge.difficulty}
                </span>
                <Link 
                  to={`/build/${challenge.id}`}
                  className="bg-[#151515] hover:bg-[#676fff] text-white hover:text-white border border-[#333] hover:border-[#676fff] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span>View Bounty</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BuildPage;
