import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage = () => {
  const { login, authenticated, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-[#333] border-t-[#676fff] animate-spin" />
      </div>
    );
  }

  if (authenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] px-6 text-slate-900 dark:text-white transition-colors relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px] bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl px-8 py-10 sm:px-10 sm:py-12 flex flex-col items-center shadow-sm dark:shadow-none">

        {/* Logo */}
        <div className="w-12 h-12 rounded-xl bg-[#676fff] flex items-center justify-center text-white font-bold text-lg mb-6 shadow-sm">
          A
        </div>

        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">ARCademy</h1>

        <p className="text-sm text-slate-500 dark:text-[#777] text-center leading-relaxed mb-8">
          Master Arc L1 architecture, verify code, and claim on-chain rewards.
        </p>

        <button
          onClick={login}
          className="w-full bg-[#676fff] hover:bg-[#5560ee] text-white font-semibold text-sm py-3.5 rounded-xl transition-colors duration-150 cursor-pointer shadow-sm"
        >
          Continue with Google, Email or Wallet
        </button>

        <p className="mt-6 text-xs text-slate-400 dark:text-[#555] text-center leading-relaxed">
          Powered by Privy MPC embedded wallets on the Arc Network. No seed phrases required.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
