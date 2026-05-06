import { formatDate, truncateText, typeBadgeClasses, typeLabels } from '../utils/helpers';

export default function HistoryCard({
  item,
  isFavorite,
  isDeleting,
  onCopy,
  onDelete,
  onDownload,
  onToggleFavorite,
  onView,
}) {
  return (
    <article className="surface-card group flex h-full flex-col p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_30px_70px_-42px_rgba(30,58,95,0.38)] dark:hover:border-sky-300/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeBadgeClasses[item.type]}`}
          >
            {typeLabels[item.type] || 'Content'}
          </span>
          {isFavorite ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
              Pinned
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(item)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition hover:-translate-y-0.5 ${
            isFavorite
              ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300'
              : 'border-slate-200/80 bg-white/85 text-slate-500 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-white/20'
          }`}
          aria-label={isFavorite ? 'Unpin draft' : 'Pin draft'}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3.5L14.6 8.8L20.5 9.6L16.2 13.7L17.2 19.5L12 16.7L6.8 19.5L7.8 13.7L3.5 9.6L9.4 8.8L12 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {formatDate(item.createdAt)}
        </p>
        <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">
          {truncateText(item.title || item.prompt, 64)}
        </h3>
        <p
          className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {truncateText(item.output, 170)}
        </p>
        <div className="mt-4 rounded-[22px] border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-xs leading-6 text-slate-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-400">
          {truncateText(item.prompt, 120)}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>{typeLabels[item.type] || 'Content'} draft</span>
          <span>{isFavorite ? 'Pinned item' : 'Saved draft'}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onView(item)} className="btn-secondary px-3 py-2.5 text-sm">
            View
          </button>
          <button type="button" onClick={() => onCopy(item)} className="btn-secondary px-3 py-2.5 text-sm">
            Copy
          </button>
          <button type="button" onClick={() => onDownload(item)} className="btn-secondary px-3 py-2.5 text-sm">
            Export
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300 dark:hover:bg-rose-400/15"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}
