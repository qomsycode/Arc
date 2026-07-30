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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
      <div className="flex items-center gap-2 bg-[#181c28] border border-[#1e2436] rounded-full px-4 py-2 text-xs text-[#555]">
        Creating wallet...
      </div>
    );
  }

  const xpPoints = profile?.xp_points || 0;

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 sm:gap-2 bg-[#181c28] border border-[#1e2436] rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 hover:border-[#676fff] transition-all duration-200 cursor-pointer group shrink-0"
      title="Copy wallet address"
    >
      {/* Live dot */}
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#3cd876] shrink-0" />

      {/* Wallet address */}
      <span className="text-xs sm:text-[13px] font-medium text-[#8892b0] font-mono group-hover:text-white transition-colors flex items-center gap-1">
        {formatAddress(walletAddress)}
        {copied ? <Check size={12} className="text-[#3cd876]" /> : <Copy size={12} className="hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity" />}
      </span>

      {!hideXp && (
        <>
          <div className="w-px h-3 bg-[#1e2436]" />
          {/* XP Points */}
          <span className="text-xs sm:text-[13px] font-bold text-[#676fff] whitespace-nowrap">
            {xpPoints} XP
          </span>
        </>
      )}
    </button>
  );
};

export default WalletBadge;
