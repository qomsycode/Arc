import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { challenges } from '../data/challenges';
import { Award, ExternalLink, ArrowLeft } from 'lucide-react';
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
  const { authenticated, ready, getAccessToken } = useAuth();
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

  if (!ready) return <div className="flex h-screen w-full bg-[#fafafa] dark:bg-[#0a0a0a]" />;
  if (!authenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors bg-grid-pattern">
      <Navbar />

      {/* Hero Header */}
      <header className="max-w-6xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-4">
        <div className="mb-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-[#676fff] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm dark:shadow-none">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-[#3cd876] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Award size={14} /> Earn USDC Bounties
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">Build Practical Arc L1 Applications</h1>
            <p className="text-slate-600 dark:text-[#8892b0] text-sm max-w-xl leading-relaxed">
              Put your knowledge to work. Select a build challenge, construct the project, and submit your GitHub link for manual reviewer approval and escrow release.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-[#222] rounded-xl p-5 min-w-[220px] w-full md:w-auto">
            <span className="text-xs font-medium text-slate-500 dark:text-[#777] block mb-1">Total Available Bounties</span>
            <p className="text-3xl font-bold text-emerald-600 dark:text-[#3cd876]">$235.00 <span className="text-sm font-normal text-slate-500 dark:text-[#8892b0]">USDC</span></p>
          </div>
        </div>
      </header>

      {/* User's Submissions List Tracker */}
      {submissions.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-8 py-3 mb-4">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-2xl p-6 shadow-sm dark:shadow-none">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <span>My Challenge Submissions</span>
            </h2>
            <div className="space-y-3">
              {submissions.map((sub) => {
                const associatedChallenge = challenges.find((c) => c.id === sub.challenge_id);
                return (
                  <div key={sub.id} className="bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-[#222] rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {associatedChallenge ? associatedChallenge.title : `Challenge #${sub.challenge_id}`}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          sub.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                          sub.status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                          'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#8892b0] mb-2 font-mono">
                        <span>Submitted GitHub:</span>
                        <a href={sub.github_url} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-[#676fff] hover:underline flex items-center gap-0.5">
                          {sub.github_url.replace('https://github.com/', '')}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                      {sub.reviewer_feedback && (
                        <div className="mt-2 p-3 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#2d2d2d] rounded-lg text-xs text-slate-700 dark:text-[#8892b0]">
                          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Reviewer Feedback:</span>
                          {sub.reviewer_feedback}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Link
                        to={`/build/${sub.challenge_id}`}
                        className="text-xs text-slate-700 dark:text-[#8892b0] hover:text-slate-900 dark:hover:text-white border border-gray-200 dark:border-[#333] hover:border-indigo-300 dark:hover:border-[#676fff] px-3.5 py-2 rounded-lg font-medium transition-all bg-white dark:bg-transparent"
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
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id} 
              className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] hover:border-indigo-300 dark:hover:border-[#444] rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 group shadow-sm dark:shadow-none"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-slate-600 dark:text-[#8892b0] bg-gray-100 dark:bg-[#1a1a1a] px-3 py-1 rounded-full border border-gray-200 dark:border-[#222]">
                    {challenge.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-[#3cd876] bg-emerald-50 dark:bg-[#3cd876]/10 border border-emerald-100 dark:border-[#3cd876]/20 px-2.5 py-1 rounded-md">
                    ${challenge.bountyAmount.toFixed(2)} USDC
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#676fff] transition-colors">{challenge.title}</h3>
                <p className="text-sm text-slate-600 dark:text-[#8892b0] line-clamp-3 mb-6 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              <div className="border-t border-gray-100 dark:border-[#222] pt-4 flex justify-between items-center">
                <span className={`text-xs font-medium ${
                  challenge.difficulty === 'Beginner' ? 'text-blue-500' :
                  challenge.difficulty === 'Intermediate' ? 'text-amber-500' : 'text-purple-500'
                }`}>
                  ● {challenge.difficulty}
                </span>
                <Link 
                  to={`/build/${challenge.id}`}
                  className="bg-gray-50 dark:bg-[#151515] hover:bg-[#676fff] text-slate-800 dark:text-white hover:text-white border border-gray-200 dark:border-[#333] hover:border-[#676fff] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
                >
                  <span>View Bounty</span>
                  <ExternalLink size={13} />
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
