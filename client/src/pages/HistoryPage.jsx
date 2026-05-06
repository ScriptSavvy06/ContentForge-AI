import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import HistoryCard from '../components/HistoryCard';
import Reveal from '../components/Reveal';
import SpotlightPanel from '../components/SpotlightPanel';
import { useWorkspace } from '../context/WorkspaceContext';
import api, { getErrorMessage } from '../services/api';
import {
  buildDownloadFilename,
  classNames,
  downloadTextFile,
  formatDate,
  typeLabels,
} from '../utils/helpers';

const filters = ['all', 'resume', 'email', 'blog'];

export default function HistoryPage() {
  const { favoriteIds, isFavorite, toggleFavorite } = useWorkspace();
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/history');

        if (isMounted) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error('History page load error:', error);
        toast.error(getErrorMessage(error, 'Unable to load your history right now.'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesFilter = filter === 'all' ? true : item.type === filter;
      const matchesPinned = onlyPinned ? favoriteIds.includes(item._id) : true;
      const searchValue = searchQuery.trim().toLowerCase();
      const matchesSearch = searchValue
        ? [item.title, item.prompt, item.output].some((value) =>
            String(value || '').toLowerCase().includes(searchValue)
          )
        : true;

      return matchesFilter && matchesPinned && matchesSearch;
    });
  }, [favoriteIds, filter, history, onlyPinned, searchQuery]);

  const pinnedResults = useMemo(
    () => filteredHistory.filter((item) => favoriteIds.includes(item._id)),
    [favoriteIds, filteredHistory]
  );

  const regularResults = useMemo(
    () => filteredHistory.filter((item) => !favoriteIds.includes(item._id)),
    [favoriteIds, filteredHistory]
  );

  const handleView = async (item) => {
    try {
      const { data } = await api.get(`/history/${item._id}`);
      setSelectedGeneration(data.generation);
    } catch (error) {
      console.error('History view error:', error);
      toast.error(getErrorMessage(error, 'Unable to open this generation.'));
    }
  };

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.output);
      toast.success('Generation copied to clipboard.');
    } catch (error) {
      console.error('History copy error:', error);
      toast.error('Unable to copy this generation right now.');
    }
  };

  const handleDownload = (item) => {
    downloadTextFile(buildDownloadFilename(item.title || item.type), item.output);
    toast.success('Generation exported as text.');
  };

  const handleToggleFavorite = (item) => {
    const alreadyFavorite = isFavorite(item._id);
    toggleFavorite(item._id);
    toast.success(alreadyFavorite ? 'Draft removed from pinned items.' : 'Draft pinned to your workspace.');
  };

  const handleDelete = async (item) => {
    const shouldDelete = window.confirm('Delete this saved generation?');

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(item._id);
      await api.delete(`/history/${item._id}`);
      setHistory((currentHistory) => currentHistory.filter((entry) => entry._id !== item._id));

      if (selectedGeneration?._id === item._id) {
        setSelectedGeneration(null);
      }

      toast.success('Generation deleted successfully.');
    } catch (error) {
      console.error('History delete error:', error);
      toast.error(getErrorMessage(error, 'Unable to delete this generation.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-shell space-y-8">
      <Reveal>
        <SpotlightPanel className="surface-card p-6 lg:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="section-kicker">History</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                Search, filter, and revisit the drafts worth keeping close
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                History keeps the real backend-powered drafts, while pinned items help you surface the outputs that matter most inside this browser.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="premium-pill">Searchable workspace</span>
                <span className="premium-pill">Pinned drafts highlighted</span>
                <span className="premium-pill">Copy, export, and delete intact</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
              <article className="surface-card-muted px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Saved drafts</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{history.length}</p>
              </article>
              <article className="surface-card-muted px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pinned</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{favoriteIds.length}</p>
              </article>
              <article className="surface-card-muted px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Visible now</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{filteredHistory.length}</p>
              </article>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
            <label className="block">
              <span className="field-label">Search saved generations</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="field-input"
                placeholder="Search by title, prompt, or output..."
              />
            </label>

            <div className="flex flex-wrap gap-2 self-end xl:justify-end">
              {filters.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={classNames(
                    'rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300',
                    filter === value
                      ? 'bg-primary text-white shadow-soft dark:bg-sky-300 dark:text-slate-950'
                      : 'bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                  )}
                >
                  {value === 'all' ? 'All' : typeLabels[value]}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setOnlyPinned((currentValue) => !currentValue)}
                className={classNames(
                  'rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300',
                  onlyPinned
                    ? 'bg-amber-500 text-slate-950 shadow-soft'
                    : 'bg-slate-100 text-slate-600 hover:-translate-y-0.5 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                )}
              >
                {onlyPinned ? 'Pinned only' : 'Show pinned'}
              </button>
            </div>
          </div>
        </SpotlightPanel>
      </Reveal>

      {loading ? (
        <Reveal>
          <div className="surface-card flex items-center gap-3 px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
            <span className="spinner-dark" />
            Loading generation history...
          </div>
        </Reveal>
      ) : filteredHistory.length === 0 ? (
        <Reveal>
          <section className="surface-card px-6 py-14 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-slate-200/70 bg-slate-50/80 text-primary shadow-soft dark:border-white/10 dark:bg-slate-900/70 dark:text-sky-300">
              <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 6.5C5 5.4 5.9 4.5 7 4.5H17C18.1 4.5 19 5.4 19 6.5V17.5C19 18.6 18.1 19.5 17 19.5H7C5.9 19.5 5 18.6 5 17.5V6.5Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 9H15.5M8.5 12H15.5M8.5 15H13.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-slate-950 dark:text-slate-50">
              {history.length === 0 ? 'No saved generations yet' : 'No drafts match this view'}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              {history.length === 0
                ? 'Once you generate content, every completed draft will appear here with search, copy, export, and pin actions.'
                : 'Try a broader search, switch filters, or turn off the pinned-only view to see more results.'}
            </p>
            <Link to="/generate" className="btn-primary mt-8">
              Create your first draft
            </Link>
          </section>
        </Reveal>
      ) : (
        <div className="space-y-8">
          {pinnedResults.length > 0 ? (
            <Reveal>
              <section className="surface-card p-6 lg:p-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="section-kicker">Pinned</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                      Drafts you wanted within reach
                    </h3>
                  </div>
                  <span className="premium-pill">
                    {pinnedResults.length} pinned draft{pinnedResults.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-3">
                  {pinnedResults.map((item, index) => (
                    <Reveal key={item._id} delay={index * 35}>
                      <HistoryCard
                        item={item}
                        isDeleting={deletingId === item._id}
                        isFavorite={isFavorite(item._id)}
                        onCopy={handleCopy}
                        onDelete={handleDelete}
                        onDownload={handleDownload}
                        onToggleFavorite={handleToggleFavorite}
                        onView={handleView}
                      />
                    </Reveal>
                  ))}
                </div>
              </section>
            </Reveal>
          ) : null}

          {regularResults.length > 0 ? (
            <Reveal delay={40}>
              <section className="surface-card p-6 lg:p-7">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="section-kicker">All matching drafts</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                      Saved work across your workspace
                    </h3>
                  </div>
                  <span className="premium-pill">
                    {regularResults.length} visible result{regularResults.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-3">
                  {regularResults.map((item, index) => (
                    <Reveal key={item._id} delay={index * 30}>
                      <HistoryCard
                        item={item}
                        isDeleting={deletingId === item._id}
                        isFavorite={isFavorite(item._id)}
                        onCopy={handleCopy}
                        onDelete={handleDelete}
                        onDownload={handleDownload}
                        onToggleFavorite={handleToggleFavorite}
                        onView={handleView}
                      />
                    </Reveal>
                  ))}
                </div>
              </section>
            </Reveal>
          ) : null}
        </div>
      )}

      {selectedGeneration ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6">
          <div className="surface-card max-h-[90vh] w-full max-w-4xl overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-slate-200/70 px-6 py-5 dark:border-white/10 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="section-kicker">{typeLabels[selectedGeneration.type]}</span>
                  {isFavorite(selectedGeneration._id) ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                      Pinned
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                  {selectedGeneration.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(selectedGeneration.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(selectedGeneration)}
                  className="btn-secondary"
                >
                  {isFavorite(selectedGeneration._id) ? 'Unpin' : 'Pin'}
                </button>
                <button type="button" onClick={() => handleCopy(selectedGeneration)} className="btn-secondary">
                  Copy
                </button>
                <button type="button" onClick={() => handleDownload(selectedGeneration)} className="btn-secondary">
                  Export
                </button>
                <button type="button" onClick={() => setSelectedGeneration(null)} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
              <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 px-5 py-5 dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Prompt</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {selectedGeneration.prompt}
                </p>
              </div>
              <div className="mt-5 workspace-canvas px-5 py-5">
                <p className="text-sm font-semibold text-sky-300">Output</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-8 text-slate-100">
                  {selectedGeneration.output}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
