import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { classNames, formatPlan } from '../utils/helpers';

const navigationItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    description: 'Usage overview and recent content',
  },
  {
    to: '/generate',
    label: 'Generate',
    description: 'Create resumes, emails, and blog posts',
  },
  {
    to: '/history',
    label: 'History',
    description: 'Review and manage saved outputs',
  },
  {
    to: '/preferences',
    label: 'Preferences',
    description: 'Theme, pinned drafts, and workspace details',
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const usagePercent =
    user?.generationsLimit > 0
      ? Math.min(100, (user.generationsUsed / user.generationsLimit) * 100)
      : 0;

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/');
  };

  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 z-30 bg-slate-950/35 transition md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-slate-200/70 bg-white/95 px-5 pb-5 pt-6 shadow-soft backdrop-blur-xl transition-transform dark:border-white/10 dark:bg-slate-950/95 md:static md:w-72 md:translate-x-0 md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <img
              src="/brand-mark.svg"
              alt="ContentAI"
              className="h-12 w-12 rounded-2xl shadow-soft"
            />
            <div>
              <p className="font-heading text-lg font-semibold text-night dark:text-slate-50">ContentAI</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Personal AI workspace</p>
            </div>
          </Link>

          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-white/10 dark:text-slate-300 md:hidden"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="surface-card mt-8 p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
          <h2 className="mt-1 text-xl font-semibold text-night dark:text-slate-50">{user?.name || 'ContentAI User'}</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary dark:bg-sky-400/10 dark:text-sky-300">
              {formatPlan(user?.plan)}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {user?.generationsUsed || 0}/{user?.generationsLimit || 0} used
            </span>
          </div>
          <div className="metric-bar mt-4">
            <div
              className="metric-bar-fill transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Calm visibility into plan status and remaining workspace runway.
          </p>
        </div>

        <nav className="mt-8 space-y-3">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'block rounded-xl border px-4 py-3 transition',
                  isActive
                    ? 'border-primary bg-primary text-white shadow-soft dark:border-sky-300 dark:bg-sky-300 dark:text-slate-950'
                    : 'border-slate-200 bg-white text-ink hover:border-accent/40 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-white/20 dark:hover:bg-slate-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <p className="font-semibold">{item.label}</p>
                  <p
                    className={classNames(
                      'mt-1 text-sm',
                      isActive ? 'text-blue-100 dark:text-slate-900/70' : 'text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {item.description}
                  </p>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <ThemeToggle className="w-full justify-center" />
          <button type="button" onClick={handleLogout} className="btn-secondary w-full">
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
