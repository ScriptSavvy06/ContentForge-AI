import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const routeMeta = {
  '/dashboard': {
    eyebrow: 'Personal workspace',
    title: 'Workspace overview',
    description: 'Your latest drafts, usage signals, and pinned work all live here.',
  },
  '/generate': {
    eyebrow: 'Hybrid AI studio',
    title: 'Structured prompt builder',
    description: 'Build a detailed brief on the left and refine the live draft on the right.',
  },
  '/history': {
    eyebrow: 'Saved output',
    title: 'History and pinned drafts',
    description: 'Search, filter, export, and revisit the drafts worth keeping close.',
  },
  '/preferences': {
    eyebrow: 'Preferences',
    title: 'Workspace settings',
    description: 'Manage your theme, workspace habits, and future-ready preferences.',
  },
};

export default function WorkspaceHeader({ onOpenMenu }) {
  const location = useLocation();
  const { user } = useAuth();

  const meta = routeMeta[location.pathname] || routeMeta['/dashboard'];

  return (
    <header className="sticky top-0 z-30 mb-6 rounded-[30px] border border-slate-200/70 bg-white/75 px-4 py-4 shadow-soft backdrop-blur-2xl transition dark:border-white/10 dark:bg-slate-950/70 md:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100 md:hidden"
            aria-label="Open workspace menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7H20M4 12H20M4 17H14" strokeLinecap="round" />
            </svg>
          </button>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent dark:text-sky-300">
              {meta.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50 lg:text-3xl">
              {meta.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {meta.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="premium-pill">Personal AI workspace</span>
              <span className="premium-pill">Theme-aware</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ThemeToggle />
          <Link to="/generate" className="btn-primary">
            New Draft
          </Link>
          <Link
            to="/preferences"
            className="inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/85 dark:hover:border-white/20"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-sky-400/10 dark:text-sky-300">
              {String(user?.name || 'U')
                .slice(0, 1)
                .toUpperCase()}
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-50">
                {user?.name || 'ContentAI user'}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Preferences and workspace details
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
