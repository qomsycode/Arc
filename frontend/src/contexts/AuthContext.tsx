import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { usePrivy, useWallets, useCreateWallet } from '@privy-io/react-auth';
import { User } from '@privy-io/react-auth';
import axios from 'axios';

interface Profile {
  id: string;
  email: string | null;
  wallet_address: string | null;
  role: 'student' | 'reviewer' | 'admin';
  xp_points: number;
}

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  ready: boolean;
  login: () => void;
  logout: () => void;
  syncing: boolean;
  walletAddress: string | null;
  getAccessToken: () => Promise<string | null>;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, authenticated, ready, login, logout, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const [syncing, setSyncing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const refreshProfile = async () => {
    if (!authenticated) return;
    try {
      const token = await getAccessToken();
      if (!token) return;
      const res = await axios.get(`${backendUrl}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  // Helper: sync user profile to backend
  const syncToBackend = async (wallet?: string | null, email?: string | null) => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const res = await axios.post(
        `${backendUrl}/api/auth/sync`,
        { wallet_address: wallet || null, email: email || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error('Backend sync error:', err);
    }
  };

  // Fetch profile when authenticated changes to true
  useEffect(() => {
    if (authenticated) {
      refreshProfile();
    } else {
      setProfile(null);
    }
  }, [authenticated]);

  // Effect 1: On login — sync profile and explicitly create wallet if none exists
  useEffect(() => {
    const handleLogin = async () => {
      if (!ready || !authenticated || !user) return;

      setSyncing(true);
      const email = user.email?.address || null;
      const address = wallets.length > 0 ? wallets[0].address : user.wallet?.address;

      // Sync basic profile first
      await syncToBackend(address, email);

      // Check if user already has any wallet
      const hasWallet = wallets.length > 0 || !!user.wallet;

      if (!hasWallet) {
        try {
          console.log('No wallet found — creating embedded wallet...');
          await createWallet();
          console.log('Embedded wallet created!');
        } catch (err: any) {
          // Wallet might already exist — safe to ignore
          if (!err?.message?.includes('already has a wallet') && !err?.message?.includes('creation is already in progress')) {
            console.error('Wallet creation error:', err);
          }
        }
      }

      setSyncing(false);
    };

    handleLogin();
  }, [ready, authenticated, user?.id]);

  // Effect 2: Watch wallets list — when wallet appears, update backend and state
  useEffect(() => {
    if (!authenticated || !user) return;

    const address = wallets.length > 0 ? wallets[0].address : user.wallet?.address;

    if (address && address !== walletAddress) {
      console.log('Wallet detected:', address);
      setWalletAddress(address);
      const email = user.email?.address || null;
      syncToBackend(address, email);
    }
  }, [wallets, user, authenticated, walletAddress]);

  return (
    <AuthContext.Provider value={{
      user,
      authenticated,
      ready,
      login,
      logout,
      syncing,
      walletAddress,
      getAccessToken,
      profile,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
