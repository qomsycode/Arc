import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WalletBadge from './WalletBadge';
import ThemeToggle from './ThemeToggle';
import { 
  LayoutDashboard, 
  BookOpen, 
  Code2, 
  Bot,
  LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/learn', label: 'Curriculum', icon: BookOpen },
  { path: '/build', label: 'Build Lab', icon: Code2 },
  { path: '/copilot', label: 'Arc Copilot', icon: Bot, isNew: true },
];

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/85 dark:bg-[#0a0a0a]/85 border-b border-neutral-200/80 dark:border-[#1a1a1a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Left: Brand + Network status */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-[#676fff] text-white flex items-center justify-center font-black text-sm tracking-tighter group-hover:scale-105 transition-transform shadow-xs">
                A
              </div>
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                AR<span className="text-indigo-600 dark:text-[#676fff]">Cademy</span>
              </span>
            </Link>

            {/* Live Arc Mainnet Status Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Arc Mainnet (5042)</span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-100 dark:bg-[#1a1a1a] text-indigo-600 dark:text-[#676fff] shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-[#141414]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                  {item.isNew && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-indigo-600/10 text-indigo-600 dark:text-[#676fff] dark:bg-[#676fff]/15">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Badges & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <ThemeToggle />
            <WalletBadge />
            <button
              onClick={logout}
              className="p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer"
              title="Disconnect / Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile subnav bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 border-t border-neutral-100 dark:border-[#141414] bg-neutral-50/50 dark:bg-[#0c0c0c]/50 text-xs">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-[#676fff] bg-white dark:bg-[#161616] shadow-2xs'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <Icon size={12} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default Navbar;
