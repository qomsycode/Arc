import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, Copy } from 'lucide-react';

interface WalletBadgeProps {
  hideXp?: boolean;
}

const WalletBadge = ({ hideXp = false }: WalletBadgeProps) => {
  const { walletAddress, profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const formatAddress = (address: string) => {
    // Shorter format on mobile screens to save precious space
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!walletAddress) {
    return (
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs text-gray-500 dark:text-[#555]">
        Connecting...
      </div>
    );
  }

  const xpPoints = profile?.xp_points || 0;

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-full px-2 py-1 sm:px-3 sm:py-1.5 hover:border-gray-300 dark:hover:border-[#333] transition-colors cursor-pointer group shrink-0 shadow-sm dark:shadow-none"
      title="Copy wallet address"
    >
      {/* Live dot */}
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />

      {/* Wallet address */}
      <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-[#8892b0] font-mono group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex items-center gap-1">
        {formatAddress(walletAddress)}
        {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity" />}
      </span>

      {!hideXp && (
        <>
          <div className="w-px h-2.5 bg-gray-200 dark:bg-[#222]" />
          {/* XP Points */}
          <span className="text-[11px] sm:text-xs font-bold text-indigo-600 dark:text-[#676fff] whitespace-nowrap">
            {xpPoints} XP
          </span>
        </>
      )}
    </button>
  );
};

export default WalletBadge;
