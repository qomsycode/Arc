import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import WalletBadge from '../components/WalletBadge';
import { challenges } from '../data/challenges';
import { ArrowLeft, Code2, ShieldAlert, Award, ExternalLink } from 'lucide-react';

const BuildPage = () => {
  const { authenticated, ready } = useAuth();

  if (!ready) return <div className="flex h-screen w-full bg-[#0a0a0a]" />;
  if (!authenticated) return <Navigate to="/login" replace />;

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
          <span className="font-bold text-lg tracking-tight">ARCademy Build Bounties</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-xs text-[#8892b0] hover:text-white border border-[#333] px-3 py-1.5 rounded-lg transition-colors">
            Admin Portal
          </Link>
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
