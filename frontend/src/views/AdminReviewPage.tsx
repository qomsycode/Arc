import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import WalletBadge from '../components/WalletBadge';
import { ArrowLeft, ExternalLink, Check, X, ShieldCheck, Code2 } from 'lucide-react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Submission {
  id: number;
  user_id: string;
  challenge_id: number;
  github_url: string;
  live_url?: string;
  wallet_address?: string;
  status: 'pending' | 'approved' | 'needs_improvement';
  reviewer_feedback?: string;
  submitted_at: string;
}

const AdminReviewPage = () => {
  const { authenticated, ready, getAccessToken } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackInput, setFeedbackInput] = useState<Record<number, string>>({});
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  const fetchAllSubmissions = async () => {
    try {
      const token = await getAccessToken();
      const res = await axios.get(`${backendUrl}/api/submissions/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error('Error fetching admin submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchAllSubmissions();
    }
  }, [authenticated]);

  if (!ready) return <div className="flex h-screen w-full bg-[#0a0a0a]" />;
  if (!authenticated) return <Navigate to="/login" replace />;

  const handleReview = async (submissionId: number, status: 'approved' | 'needs_improvement') => {
    setReviewingId(submissionId);
    try {
      const token = await getAccessToken();
      const feedback = feedbackInput[submissionId] || '';
      await axios.post(`${backendUrl}/api/submissions/admin/review/${submissionId}`, {
        status,
        feedback
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchAllSubmissions();
    } catch (err) {
      console.error('Review submission error:', err);
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="w-full border-b border-[#222] px-8 py-4 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link to="/build" className="text-[#8892b0] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft size={18} />
            <span>Build Section</span>
          </Link>
          <div className="h-4 w-[1px] bg-[#222]" />
          <span className="font-bold text-lg tracking-tight flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#676fff]" />
            <span>Admin Reviewer Portal</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <WalletBadge />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Review Queue</h1>
          <p className="text-[#8892b0] text-sm">
            Review user code submissions, verify requirements, leave feedback notes, and release USDC escrow bounties.
          </p>
        </div>

        {loading ? (
          <div className="text-[#777] text-sm py-12">Loading submissions queue...</div>
        ) : submissions.length === 0 ? (
          <div className="bg-[#111] border border-[#222] rounded-2xl p-12 text-center text-[#777]">
            No submissions in the queue yet.
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-[#111] border border-[#222] rounded-2xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-[#222]">
                  <div>
                    <span className="text-xs font-semibold text-[#8892b0] uppercase tracking-wider block mb-1">
                      Challenge #{sub.challenge_id}
                    </span>
                    <p className="text-xs text-[#555] font-mono">User ID: {sub.user_id}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    sub.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <Code2 size={16} className="text-[#8892b0]" />
                    <span className="font-semibold">GitHub Repo:</span>
                    <a href={sub.github_url} target="_blank" rel="noreferrer" className="text-[#676fff] hover:underline">
                      {sub.github_url}
                    </a>
                  </div>
                  {sub.live_url && (
                    <div className="flex items-center gap-2 text-sm text-white">
                      <ExternalLink size={16} className="text-[#8892b0]" />
                      <span className="font-semibold">Live Demo:</span>
                      <a href={sub.live_url} target="_blank" rel="noreferrer" className="text-[#676fff] hover:underline">
                        {sub.live_url}
                      </a>
                    </div>
                  )}
                  {sub.wallet_address && (
                    <p className="text-xs text-[#666]">Target Wallet: {sub.wallet_address}</p>
                  )}
                </div>

                {sub.status === 'pending' ? (
                  <div className="bg-[#151515] border border-[#222] rounded-xl p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#777] mb-1">Reviewer Feedback Notes</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Code looks clean! SafeERC20 correctly implemented."
                        value={feedbackInput[sub.id] || ''}
                        onChange={(e) => setFeedbackInput({ ...feedbackInput, [sub.id]: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#676fff]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReview(sub.id, 'approved')}
                        disabled={reviewingId === sub.id}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check size={16} />
                        <span>Approve & Release Escrow</span>
                      </button>
                      <button
                        onClick={() => handleReview(sub.id, 'needs_improvement')}
                        disabled={reviewingId === sub.id}
                        className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-medium px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <X size={16} />
                        <span>Request Revision</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  sub.reviewer_feedback && (
                    <div className="p-3 bg-[#151515] border border-[#222] rounded-lg text-xs text-[#8892b0]">
                      <span className="font-bold text-white block mb-1">Feedback Left:</span>
                      {sub.reviewer_feedback}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReviewPage;
