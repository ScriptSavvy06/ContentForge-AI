import { useMemo } from 'react';

import Reveal from '../components/Reveal';
import SpotlightPanel from '../components/SpotlightPanel';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { formatPlan } from '../utils/helpers';

export default function PreferencesPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { favoriteIds, clearFavorites } = useWorkspace();

  const preferencesSummary = useMemo(
    () => [
      {
        label: 'Current theme',
        value: theme === 'dark' ? 'Dark mode' : 'Light mode',
      },
      {
        label: 'Pinned drafts',
        value: `${favoriteIds.length} saved locally`,
      },
      {
        label: 'Plan',
        value: formatPlan(user?.plan),
      },
    ],
    [favoriteIds.length, theme, user?.plan]
  );

  return (
    <div className="page-shell space-y-8">
      <Reveal>
        <SpotlightPanel className="surface-card p-6 lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent dark:text-sky-300">
              Preferences
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
              Tune the workspace to your flow
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              This page keeps theme controls and workspace habits in one place today, while making room for future profile and settings expansion without changing the rest of the app.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {preferencesSummary.map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-900/70"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-50">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <section className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Theme</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Switch instantly between a bright writing surface and a deeper, focus-friendly dark workspace.
                  </p>
                </div>
                <ThemeToggle />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {['light', 'dark'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={`rounded-3xl border px-5 py-4 text-left transition ${
                      theme === value
                        ? 'border-primary bg-primary text-white shadow-glow dark:border-sky-300 dark:bg-sky-300 dark:text-slate-950'
                        : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-white/20'
                    }`}
                  >
                    <p className="font-semibold capitalize">{value} mode</p>
                    <p className={`mt-2 text-sm ${theme === value ? 'text-white/80 dark:text-slate-900/75' : 'text-slate-500 dark:text-slate-400'}`}>
                      {value === 'light'
                        ? 'Bright, crisp, and ideal for daytime editing.'
                        : 'Calmer contrast for longer writing sessions.'}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-slate-950/70">
              <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Pinned drafts</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Favorites are currently stored in this browser so you can quickly surface important drafts on the dashboard and history pages. Backend syncing can be added later without changing the UI structure.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
                  {favoriteIds.length} pinned drafts in this browser
                </span>
                <button type="button" onClick={clearFavorites} className="btn-secondary">
                  Clear pinned drafts
                </button>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-soft dark:border-white/10 dark:bg-slate-950/70">
              <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Workspace direction</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-900/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Motion preference</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    The interface already respects the system reduced-motion preference. A manual workspace override can slot in here later if needed.
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-900/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Export defaults</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Text export is ready today. Richer export preferences can be added without changing the current workspace flow.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
        </SpotlightPanel>
      </Reveal>
    </div>
  );
}
