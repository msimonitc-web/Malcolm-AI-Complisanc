import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'pill' | 'menu-item' | 'player-bar';
  className?: string;
  showBadge?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
  showBadge = false,
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'menu-item') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
          isDark
            ? 'text-amber-300 hover:bg-slate-800'
            : 'text-slate-700 hover:bg-slate-100'
        } ${className}`}
        role="switch"
        aria-checked={isDark}
      >
        <div className="flex items-center gap-2">
          {isDark ? (
            <Moon className="w-4 h-4 text-amber-300" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
          <span>{isDark ? 'Dark Theme (Night Study)' : 'Light Theme (Day Study)'}</span>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {isDark ? 'On' : 'Off'}
        </span>
      </button>
    );
  }

  if (variant === 'player-bar') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
          isDark
            ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25'
            : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
        } ${className}`}
        title={
          isDark
            ? 'Switch to Day Light Mode'
            : 'Enable Night Reading Mode to reduce eye fatigue during long compliance study sessions'
        }
        aria-label="Toggle Night Study Mode"
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="hidden sm:inline">Night Study On</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">Night Mode</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
          isDark
            ? 'bg-slate-900/90 text-amber-300 border-amber-400/40 hover:border-amber-400 shadow-xs'
            : 'bg-[#0d2250] text-slate-200 border-[#1b3a7a] hover:border-amber-400/50'
        } ${className}`}
        title={
          isDark
            ? 'Switch to Light Theme'
            : 'Switch to Dark Theme (Reduces Eye Strain for Extended Study)'
        }
        aria-label="Toggle dark theme"
        role="switch"
        aria-checked={isDark}
      >
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${
            isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-white/10 text-amber-400'
          }`}
        >
          {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </span>
        <span className="text-[11px] tracking-wide">
          {isDark ? 'Dark Theme' : 'Light Theme'}
        </span>
        {showBadge && isDark && (
          <span className="text-[9px] px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded uppercase font-extrabold tracking-wider">
            Eye Comfort
          </span>
        )}
      </button>
    );
  }

  // Default 'compact' for navigation bars and headers
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center border focus:outline-hidden focus:ring-2 focus:ring-amber-400/50 ${
        isDark
          ? 'bg-[#0f1d38] border-amber-400/40 text-amber-300 hover:bg-[#15274d] shadow-2xs'
          : 'bg-[#0d2250] border-[#1b3a7a] text-slate-200 hover:text-white hover:bg-[#122c66]'
      } ${className}`}
      title={
        isDark
          ? 'Switch to Light Theme'
          : 'Switch to Dark Theme (Reduces eye strain for extended compliance reading)'
      }
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      role="switch"
      aria-checked={isDark}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-amber-300 transition-transform hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      )}
      <span className="sr-only">
        {isDark ? 'Disable Dark Theme' : 'Enable Dark Theme'}
      </span>
    </button>
  );
};
