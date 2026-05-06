import { useTheme } from '../context/ThemeContext';
import { classNames } from '../utils/helpers';

export default function ThemeToggle({ compact = false, className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={classNames(
        'group inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-white/20 dark:hover:bg-slate-900',
        compact ? 'h-11 w-11' : 'gap-3 px-4 py-2.5',
        className
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className={classNames(
            'absolute h-5 w-5 transition duration-300',
            isDark ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5V5.5M12 18.5V21.5M21.5 12H18.5M5.5 12H2.5M18.7 5.3L16.5 7.5M7.5 16.5L5.3 18.7M18.7 18.7L16.5 16.5M7.5 7.5L5.3 5.3" />
        </svg>

        <svg
          viewBox="0 0 24 24"
          className={classNames(
            'absolute h-5 w-5 transition duration-300',
            isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M20 15.5A8 8 0 1 1 8.5 4a6.5 6.5 0 0 0 11.5 11.5Z" />
        </svg>
      </span>

      {!compact ? (
        <span className="text-sm font-semibold">{isDark ? 'Dark mode' : 'Light mode'}</span>
      ) : null}
    </button>
  );
}
