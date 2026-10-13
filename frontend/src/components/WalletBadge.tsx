import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, Copy, ExternalLink, Coins } from 'lucide-react';
import axios from 'axios';

interface WalletBadgeProps {
  hideXp?: boolean;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const WalletBadge = ({ hideXp = false }: WalletBadgeProps) => {
  const { walletAddress, profile, authenticated, getAccessToken } = useAuth();
  const [copied, setCopied] = useState(false);
  const [computedXp, setComputedXp] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<string>('0.00');

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. Fetch user progress and rewards balance
  useEffect(() => {
    const fetchBalanceAndXp = async () => {
      if (!authenticated) return;
      try {
        const token = await getAccessToken();
        if (!token) return;

        // Fetch completed lessons count to ensure XP is always accurate
        const resProgress = await axios.get(`${backendUrl}/api/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const completed = (resProgress.data.progress || []).filter(
          (r: any) => r.status === 'completed' && r.score >= 80
        );
        const progressXp = completed.length * 50;

        // Profile XP takes precedence if greater, fallback to computed progress
        const finalXp = Math.max(profile?.xp_points || 0, progressXp);
        setComputedXp(finalXp);

        // Fetch earned reward balance (each completed module awards $0.01 USDC)
        const earnedUsdc = (completed.length * 0.01).toFixed(2);
        setUsdcBalance(earnedUsdc);
      } catch (err) {
        console.error('Error fetching badge data:', err);
      }
    };

    fetchBalanceAndXp();
  }, [authenticated, profile?.xp_points]);

  if (!walletAddress) {
    return (
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-full px-2.5 py-1 text-[11px] sm:text-xs text-gray-500 dark:text-[#555]">
        Connecting...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Wallet Pill with copy */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-full px-2 py-1 sm:px-3 sm:py-1.5 hover:border-gray-300 dark:hover:border-[#333] transition-colors cursor-pointer group shadow-sm dark:shadow-none"
        title="Copy wallet address"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-[#8892b0] font-mono group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-1">
          {formatAddress(walletAddress)}
          {copied ? (
            <Check size={11} className="text-emerald-500" />
          ) : (
            <Copy size={11} className="hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </button>

      {/* USDC Balance Pill */}
      <a
        href={`https://explorer.arc.network/address/${walletAddress}`}
        target="_blank"
        rel="noreferrer"
        className="hidden sm:flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:border-emerald-400 transition-colors"
        title="View on Arc Explorer"
      >
        <Coins size={12} />
        <span>${usdcBalance} USDC</span>
        <ExternalLink size={10} className="opacity-60" />
      </a>

      {/* XP Points Pill */}
      {!hideXp && (
        <div className="flex items-center bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-bold text-indigo-700 dark:text-[#676fff]">
          {computedXp} XP
        </div>
      )}
    </div>
  );
};

export default WalletBadge;
