import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-[#111] text-amber-300 border-[#1a1a1a] hover:border-[#333]'
          : 'bg-white text-slate-700 border-gray-200 hover:border-gray-300 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
