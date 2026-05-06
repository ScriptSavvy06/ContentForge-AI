import { formatDate, refineActions, truncateText } from '../utils/helpers';

function ActionIcon({ type, className = 'h-4 w-4' }) {
  const paths = {
    copy: (
      <>
        <rect x="9" y="9" width="10" height="10" rx="2" />
        <path d="M15 9V7C15 5.9 14.1 5 13 5H7C5.9 5 5 5.9 5 7V13C5 14.1 5.9 15 7 15H9" />
      </>
    ),
    download: <path d="M12 4V14M8 10L12 14L16 10M5 18H19" strokeLinecap="round" strokeLinejoin="round" />,
    refresh: <path d="M20 11A8 8 0 1 0 18 16M20 11V6M20 11H15" strokeLinecap="round" strokeLinejoin="round" />,
    spark: <path d="M12 3.5L14.7 9.3L20.5 12L14.7 14.7L12 20.5L9.3 14.7L3.5 12L9.3 9.3L12 3.5Z" strokeLinecap="round" strokeLinejoin="round" />,
    arrow: <path d="M12 5V19M6 13L12 19L18 13" strokeLinecap="round" strokeLinejoin="round" />,
  };

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      {paths[type] || paths.spark}
    </svg>
  );
}

const refineIconMap = {
  shorter: 'copy',
  expand: 'arrow',
  professional: 'spark',
  friendly: 'spark',
  clearer: 'refresh',
  continue: 'arrow',
};

export default function OutputBox({
  activeType,
  content,
  isStreaming,
  statusMessage,
  onCopy,
  onDownload,
  onRegenerate,
  onRefine,
  requestSummary,
  savedGeneration,
  hasGeneratedDraft,
}) {
  const hasContent = Boolean(content.trim());

  return (
    <section className="surface-card flex flex-col p-6 lg:p-7">
      <div className="flex flex-col gap-5 border-b border-slate-200/70 pb-5 dark:border-white/10 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="section-kicker">AI workspace</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-slate-50">
            Live drafting surface
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            Watch the response stream in, then refine, export, or regenerate without rebuilding the entire request.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onCopy} disabled={!hasContent} className="toolbar-button">
            <ActionIcon type="copy" />
            Copy
          </button>
          <button type="button" onClick={onDownload} disabled={!hasContent} className="toolbar-button">
            <ActionIcon type="download" />
            Export text
          </button>
          <button type="button" onClick={onRegenerate} disabled={!hasGeneratedDraft || isStreaming} className="toolbar-button">
            <ActionIcon type="refresh" />
            Regenerate
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {requestSummary ? (
          <div className="ml-auto max-w-xl rounded-[28px] border border-slate-200/80 bg-white/85 px-5 py-4 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Your brief</p>
            <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{requestSummary}</p>
          </div>
        ) : null}

        <div className="workspace-canvas min-h-[430px] overflow-hidden rounded-[32px]">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-300">ContentAI response</p>
                <p className="mt-1 text-sm text-slate-400">{activeType ? `${activeType} drafting workspace` : 'Drafting workspace'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                  {isStreaming ? 'Streaming live' : hasContent ? 'Ready to refine' : 'Ready to draft'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                  {isStreaming ? 'Thinking...' : savedGeneration ? 'Saved to history' : 'Awaiting output'}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 py-5">
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                {isStreaming ? 'Refining tone' : hasContent ? 'Draft ready' : 'Ready to draft'}
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                {statusMessage || 'Waiting for your next request.'}
              </div>
            </div>

            {hasContent ? (
              <div className="rounded-[28px] bg-white px-5 py-5 text-sm leading-8 text-slate-800 shadow-soft dark:bg-slate-900 dark:text-slate-100">
                <div className="mb-4 flex flex-wrap gap-3">
                  {[
                    ['Mode', isStreaming ? 'Streaming' : 'Draft ready'],
                    ['Output', activeType ? `${activeType} draft` : 'Draft'],
                    ['Status', savedGeneration ? 'Saved' : 'Working copy'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      <span className="font-semibold text-slate-700 dark:text-slate-100">{label}:</span> {value}
                    </div>
                  ))}
                </div>
                <div className="whitespace-pre-wrap">
                  {content}
                  {isStreaming ? <span className="typing-cursor" /> : null}
                </div>
              </div>
            ) : isStreaming ? (
              <div className="space-y-4 rounded-[28px] bg-white px-5 py-5 shadow-soft dark:bg-slate-900">
                <div className="skeleton-line h-4 w-2/3" />
                <div className="skeleton-line h-4 w-full" />
                <div className="skeleton-line h-4 w-5/6" />
                <div className="skeleton-line h-4 w-4/6" />
                <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                  ContentAI is drafting your next version now...
                </div>
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/5">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-300 to-blue-500 shadow-glow" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">Your draft will appear here</h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
                  Start with a prompt template or build your own brief. Once you generate, this area becomes a live AI workspace with refine controls, export actions, and saved-result status.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['Ready to draft', 'Streaming response', 'Refine controls'].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Quick refine actions</p>
              <p className="field-helper">
                These trigger another generation using your current brief plus the existing draft.
              </p>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {savedGeneration ? `Saved ${formatDate(savedGeneration.createdAt)}` : 'Auto-saves after completion'}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {refineActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => onRefine(action)}
                disabled={!hasContent || isStreaming}
                className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-950 dark:hover:border-white/20"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-sky-400/10 dark:text-sky-300">
                    <ActionIcon type={refineIconMap[action.id]} />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{action.label}</p>
                    <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                      {truncateText(action.instruction, 80)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200/70 bg-white/80 px-5 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
          <span>{statusMessage || 'Waiting for your next request.'}</span>
          {savedGeneration ? (
            <span className="font-medium text-emerald-600 dark:text-emerald-300">
              Saved to history: {truncateText(savedGeneration.title, 40)}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
