import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { login, authenticated, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <div className="w-5 h-5 rounded-full border-2 border-[#333] border-t-white animate-spin" />
      </div>
    );
  }

  if (authenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-[400px] bg-[#111] border border-[#222] rounded-2xl px-10 py-12 flex flex-col items-center">

        {/* Logo */}
        <div className="w-12 h-12 rounded-xl bg-[#676fff] flex items-center justify-center text-white font-bold text-lg mb-6">
          A
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">ARCademy</h1>

        <p className="text-sm text-[#777] text-center leading-relaxed mb-10">
          Learn, build, and earn on the Arc L1 Blockchain.
        </p>

        <button
          onClick={login}
          className="w-full bg-[#676fff] hover:bg-[#5560ee] text-white font-semibold text-sm py-3.5 rounded-xl transition-colors duration-150 cursor-pointer"
        >
          Continue with Gmail or Wallet
        </button>

        <p className="mt-6 text-xs text-[#555] text-center leading-relaxed">
          New here? A secure Arc L1 wallet will be created automatically.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
