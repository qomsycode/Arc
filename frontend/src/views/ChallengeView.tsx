import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { challenges } from '../data/challenges';
import WalletBadge from '../components/WalletBadge';
import { ArrowLeft, ExternalLink, Code2, Send } from 'lucide-react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Submission {
  id: number;
  github_url: string;
  live_url?: string;
  status: 'pending' | 'approved' | 'needs_improvement';
  reviewer_feedback?: string;
  submitted_at: string;
}

const ChallengeView = () => {
  const { id } = useParams();
  const { authenticated, ready, getAccessToken, walletAddress } = useAuth();
  
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<Submission | null>(null);

  const challenge = challenges.find(c => c.id === Number(id));

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!authenticated || !challenge) return;
      try {
        const token = await getAccessToken();
        const res = await axios.get(`${backendUrl}/api/submissions/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const mySubs: Submission[] = res.data.submissions || [];
        const match = mySubs.find((s: any) => s.challenge_id === challenge.id);
        if (match) {
          setExistingSubmission(match);
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, [authenticated, challenge?.id]);

  if (!ready) return <div className="flex h-screen w-full bg-[#0a0a0a]" />;
  if (!authenticated) return <Navigate to="/login" replace />;
  if (!challenge) return <Navigate to="/build" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl) {
      setError('GitHub Repository URL is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = await getAccessToken();
      const res = await axios.post(`${backendUrl}/api/submissions/submit`, {
        challengeId: challenge.id,
        githubUrl,
        liveUrl,
        walletAddress
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExistingSubmission(res.data.submission);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to submit challenge');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="w-full border-b border-[#222] px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10 gap-2">
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <Link to="/build" className="text-[#8892b0] hover:text-white transition-colors shrink-0">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base min-w-0">
            <span className="font-semibold text-[#555] shrink-0">Challenge #{challenge.id}:</span>
            <span className="font-bold text-white truncate max-w-[120px] sm:max-w-none">{challenge.title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <WalletBadge />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-[#8892b0] bg-[#151515] border border-[#222] px-3 py-1 rounded-full mb-3 inline-block">
              {challenge.category}
            </span>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
          </div>
          <div className="bg-[#151515] border border-[#3cd876]/30 px-6 py-3 rounded-xl flex items-center gap-3">
            <span className="text-xs font-medium text-[#777]">Bounty Reward:</span>
            <span className="text-2xl font-bold text-[#3cd876]">${challenge.bountyAmount.toFixed(2)} USDC</span>
          </div>
        </div>

        <p className="text-[#8892b0] text-lg mb-10 leading-relaxed">
          {challenge.description}
        </p>

        {/* Grid of details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Objectives */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              🎯 Key Objectives
            </h3>
            <ul className="space-y-3 text-sm text-[#8892b0]">
              {challenge.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#676fff] font-bold">✓</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              📋 Requirements
            </h3>
            <ul className="space-y-3 text-sm text-[#8892b0]">
              {challenge.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Starter Resources */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 mb-12">
          <h3 className="font-bold text-lg mb-4 text-white">🔗 Starter Resources</h3>
          <div className="flex flex-wrap gap-4">
            {challenge.starterResources.map((res, idx) => (
              <a 
                key={idx} 
                href={res.url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#151515] hover:bg-[#222] border border-[#333] px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 text-[#8892b0] hover:text-white"
              >
                <span>{res.title}</span>
                <ExternalLink size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Submission Section */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
          <h3 className="font-bold text-xl mb-2 text-white">🚀 Submit Your Project</h3>
          <p className="text-sm text-[#8892b0] mb-6">
            Once submitted, your project will enter the review queue. Upon reviewer approval, your ${challenge.bountyAmount.toFixed(2)} USDC bounty will be released directly to your embedded wallet.
          </p>

          {existingSubmission ? (
            <div className="bg-[#151515] border border-[#222] rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-white">Your Submission Status:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  existingSubmission.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  existingSubmission.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {existingSubmission.status}
                </span>
              </div>
              <p className="text-xs text-[#777] mb-2">GitHub Repository:</p>
              <a 
                href={existingSubmission.github_url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-sm text-[#676fff] hover:underline flex items-center gap-1 mb-4"
              >
                <Code2 size={14} />
                <span>{existingSubmission.github_url}</span>
              </a>

              {existingSubmission.reviewer_feedback && (
                <div className="mt-4 p-4 bg-[#1e1e1e] rounded-lg border border-[#333]">
                  <span className="text-xs font-bold text-white block mb-1">Reviewer Feedback:</span>
                  <p className="text-sm text-[#8892b0]">{existingSubmission.reviewer_feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#8892b0] uppercase tracking-wider mb-2">
                  GitHub Repository URL *
                </label>
                <input 
                  type="url" 
                  required
                  placeholder="https://github.com/your-username/arc-project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full bg-[#151515] border border-[#333] focus:border-[#676fff] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8892b0] uppercase tracking-wider mb-2">
                  Live Demo URL (Optional)
                </label>
                <input 
                  type="url" 
                  placeholder="https://my-arc-dapp.vercel.app"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full bg-[#151515] border border-[#333] focus:border-[#676fff] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#676fff] hover:bg-[#5560ee] text-white font-medium px-8 py-3.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Send size={16} />
                <span>{submitting ? 'Submitting...' : 'Submit Project for Review'}</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChallengeView;
