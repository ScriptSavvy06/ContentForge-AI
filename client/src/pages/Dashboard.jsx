import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import Reveal from '../components/Reveal';
import SpotlightPanel from '../components/SpotlightPanel';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import api, { getErrorMessage } from '../services/api';
import {
  formatPlan,
  formatRelativeTime,
  generatorTabs,
  truncateText,
  typeBadgeClasses,
  typeLabels,
} from '../utils/helpers';

function getUsageBreakdown(history) {
  return history.reduce(
    (accumulator, item) => ({
      ...accumulator,
      [item.type]: accumulator[item.type] + 1,
    }),
    { resume: 0, email: 0, blog: 0 }
  );
}

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const { favoriteIds } = useWorkspace();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [{ data: statsData }, { data: historyData }] = await Promise.all([
          api.get('/user/stats'),
          api.get('/history'),
        ]);

        if (!isMounted) {
          return;
        }

        setStats(statsData.stats);
        setHistory(historyData.history);
        updateUser({
          plan: statsData.stats.plan,
          generationsUsed: statsData.stats.generationsUsed,
          generationsLimit: statsData.stats.generationsLimit,
        });
      } catch (error) {
        console.error('Dashboard page error:', error);
        toast.error(getErrorMessage(error, 'Unable to load your dashboard.'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const usageBreakdown = useMemo(() => getUsageBreakdown(history), [history]);
  const pinnedDrafts = useMemo(
    () => history.filter((item) => favoriteIds.includes(item._id)).slice(0, 3),
    [favoriteIds, history]
  );
  const recentActivity = useMemo(() => history.slice(0, 5), [history]);
  const remainingCredits = Math.max(
    0,
    (stats?.generationsLimit || user?.generationsLimit || 0) -
      (stats?.generationsUsed || user?.generationsUsed || 0)
  );

  return (
    <div className="page-shell space-y-8">
      <Reveal>
        <SpotlightPanel className="surface-card overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 lg:p-9">
              <p className="section-kicker">Workspace overview</p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
                Welcome back, {user?.name || 'Creator'}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                Your workspace is set up for fast starts: recent drafts, pinned output, usage visibility, and direct paths into each generator.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="premium-pill">Pinned drafts nearby</span>
                <span className="premium-pill">Live drafting workspace</span>
                <span className="premium-pill">Searchable history</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {generatorTabs.map((tab) => (
                  <Link key={tab.id} to={`/generate?type=${tab.id}`} className="btn-secondary">
                    New {tab.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface-card-strong p-7 lg:p-9">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Usage snapshot</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-white/10 p-5">
                  <p className="text-sm text-blue-100">Remaining generations</p>
                  <p className="mt-2 text-4xl font-semibold">{remainingCredits}</p>
                </div>
                <div className="rounded-[28px] bg-white/10 p-5">
                  <p className="text-sm text-blue-100">Plan type</p>
                  <p className="mt-2 text-4xl font-semibold">{formatPlan(stats?.plan || user?.plan)}</p>
                </div>
              </div>

              <div className="mt-6 rounded-[28px] bg-white/10 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-blue-100">Current usage</span>
                  <span className="text-sm font-semibold">
                    {stats?.generationsUsed || user?.generationsUsed || 0}/{stats?.generationsLimit || user?.generationsLimit || 0}
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{
                      width: `${stats?.generationsLimit || user?.generationsLimit ? (((stats?.generationsUsed || user?.generationsUsed || 0) / (stats?.generationsLimit || user?.generationsLimit || 1)) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </SpotlightPanel>
      </Reveal>

      <Reveal className="grid gap-5 xl:grid-cols-4">
        <article className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Total drafts</p>
          <h3 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
            {loading ? '...' : stats?.totalGenerations ?? 0}
          </h3>
        </article>
        <article className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">This month</p>
          <h3 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
            {loading ? '...' : stats?.generationsThisMonth ?? 0}
          </h3>
        </article>
        <article className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Pinned drafts</p>
          <h3 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">{favoriteIds.length}</h3>
        </article>
        <article className="stat-card">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Workspace status</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">Ready for your next draft</h3>
        </article>
      </Reveal>

      <section className="grid gap-8 xl:grid-cols-[0.74fr_0.26fr]">
        <div className="space-y-8">
          <Reveal>
            <section className="surface-card p-6 lg:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker">Recent activity</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                  What you created most recently
                </h3>
              </div>
              <Link to="/history" className="btn-secondary">
                Open history
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="spinner-dark" />
                Loading activity...
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center dark:border-white/15 dark:bg-slate-900/65">
                <h4 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">No drafts yet</h4>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  Start with any generator and your latest workspace activity will appear here with timestamps, previews, and pinned highlights.
                </p>
                <Link to="/generate" className="btn-primary mt-6">
                  Create your first draft
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentActivity.map((item) => (
                  <article
                    key={item._id}
                    className="rounded-[28px] border border-slate-200/70 bg-white/70 px-5 py-5 dark:border-white/10 dark:bg-slate-900/70"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeBadgeClasses[item.type]}`}>
                          {typeLabels[item.type]}
                        </span>
                        <h4 className="mt-4 text-xl font-semibold text-slate-950 dark:text-slate-50">
                          {truncateText(item.title || item.prompt, 64)}
                        </h4>
                        <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                          {truncateText(item.output, 140)}
                        </p>
                      </div>
                      <div className="text-sm text-slate-400 dark:text-slate-500">
                        {formatRelativeTime(item.createdAt)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            </section>
          </Reveal>

          <Reveal delay={60}>
            <section className="surface-card p-6 lg:p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="section-kicker">Pinned drafts</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                  Keep important outputs within reach
                </h3>
              </div>
              <Link to="/history" className="btn-secondary">
                Manage pins
              </Link>
            </div>

            {pinnedDrafts.length === 0 ? (
              <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 dark:border-white/15 dark:bg-slate-900/65">
                <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">Nothing pinned yet</p>
                <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  Favorite drafts from history to keep the most useful outputs surfaced here. Pins are stored locally in this browser for now.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {pinnedDrafts.map((item) => (
                  <article key={item._id} className="surface-card-muted p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeBadgeClasses[item.type]}`}>
                        {typeLabels[item.type]}
                      </span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                        Pinned
                      </span>
                    </div>
                    <h4 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">
                      {truncateText(item.title || item.prompt, 52)}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {truncateText(item.output, 105)}
                    </p>
                  </article>
                ))}
              </div>
            )}
            </section>
          </Reveal>
        </div>

        <div className="space-y-8">
          <Reveal delay={40}>
            <section className="surface-card p-6">
            <p className="section-kicker">Usage by generator</p>
            <div className="mt-5 space-y-4">
              {generatorTabs.map((tab) => (
                <div key={tab.id}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{tab.label}</span>
                    <span className="text-slate-500 dark:text-slate-400">{usageBreakdown[tab.id]}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-accent to-primary dark:from-sky-300 dark:to-blue-500"
                      style={{
                        width: `${history.length ? (usageBreakdown[tab.id] / history.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            </section>
          </Reveal>

          <Reveal delay={90}>
            <section className="surface-card p-6">
            <p className="section-kicker">Quick links</p>
            <div className="mt-5 space-y-3">
              {generatorTabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={`/generate?type=${tab.id}`}
                  className="block rounded-[24px] border border-slate-200/70 bg-slate-50/80 px-4 py-4 transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-white/20"
                >
                  <p className="font-semibold text-slate-950 dark:text-slate-50">Create {tab.label.toLowerCase()}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tab.description}</p>
                </Link>
              ))}
              <Link
                to="/preferences"
                className="block rounded-[24px] border border-dashed border-slate-300 px-4 py-4 text-sm font-medium text-slate-600 transition hover:border-slate-400 dark:border-white/15 dark:text-slate-300"
              >
                Open preferences and theme settings
              </Link>
            </div>
            </section>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
