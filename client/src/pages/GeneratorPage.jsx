import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import GeneratorForm from '../components/GeneratorForm';
import OutputBox from '../components/OutputBox';
import Reveal from '../components/Reveal';
import SpotlightPanel from '../components/SpotlightPanel';
import { useAuth } from '../context/AuthContext';
import { streamGeneration } from '../services/streamService';
import {
  buildDownloadFilename,
  buildGenerationSummary,
  classNames,
  downloadTextFile,
  generatorTabs,
} from '../utils/helpers';

function isSupportedType(type) {
  return generatorTabs.some((tab) => tab.id === type);
}

export default function GeneratorPage() {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [output, setOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Choose a prompt template or build your own brief to begin.');
  const [savedGeneration, setSavedGeneration] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usageInfo, setUsageInfo] = useState(null);
  const [lastSubmittedValues, setLastSubmittedValues] = useState(null);
  const [requestSummary, setRequestSummary] = useState('');
  const abortControllerRef = useRef(null);

  const queryType = searchParams.get('type');
  const activeType = isSupportedType(queryType) ? queryType : 'resume';
  const currentUsage = useMemo(
    () => ({
      generationsUsed: usageInfo?.generationsUsed ?? user?.generationsUsed ?? 0,
      generationsLimit: usageInfo?.generationsLimit ?? user?.generationsLimit ?? 0,
    }),
    [usageInfo, user]
  );

  useEffect(() => {
    if (!queryType || !isSupportedType(queryType)) {
      setSearchParams({ type: 'resume' }, { replace: true });
    }
  }, [queryType, setSearchParams]);

  useEffect(() => {
    setOutput('');
    setSavedGeneration(null);
    setLastSubmittedValues(null);
    setRequestSummary('');
    setStatusMessage('Choose a prompt template or build your own brief to begin.');
  }, [activeType]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleTypeChange = (nextType) => {
    setSearchParams({ type: nextType });
  };

  const handleCopy = async () => {
    if (!output.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      toast.success('Draft copied to clipboard.');
    } catch (error) {
      console.error('Generator copy error:', error);
      toast.error('Unable to copy the draft right now.');
    }
  };

  const handleDownload = () => {
    if (!output.trim()) {
      return;
    }

    const filename = buildDownloadFilename(savedGeneration?.title || `${activeType}-draft`);
    downloadTextFile(filename, output);
    toast.success('Draft downloaded as a text file.');
  };

  const handleStopStream = () => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setStatusMessage('Generation cancelled.');
  };

  const runGeneration = async (payload, summarySource) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setOutput('');
    setSavedGeneration(null);
    setShowLimitModal(false);
    setStatusMessage('Preparing your AI generation...');
    setIsStreaming(true);
    setRequestSummary(buildGenerationSummary(activeType, summarySource));

    try {
      await streamGeneration({
        type: activeType,
        payload,
        signal: abortControllerRef.current.signal,
        onStart: () => {
          setStatusMessage('Streaming your content in real time...');
        },
        onToken: (token) => {
          setOutput((currentOutput) => currentOutput + token);
        },
        onDone: (data) => {
          setSavedGeneration(data.generation);
          setUsageInfo(data.usage);
          setStatusMessage(data.message);
          updateUser({
            generationsUsed: data.usage.generationsUsed,
            generationsLimit: data.usage.generationsLimit,
          });
          toast.success('Generation complete and saved to history.');
        },
      });
    } catch (error) {
      console.error('Generator page stream error:', error);

      if (error.name === 'AbortError') {
        return;
      }

      if (error.code === 'LIMIT_REACHED') {
        setUsageInfo(error.details?.usage || currentUsage);
        setStatusMessage(error.message);
        setShowLimitModal(true);
        return;
      }

      setStatusMessage(error.message || 'Unable to generate content right now.');
      toast.error(error.message || 'Unable to generate content right now.');
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = async (values) => {
    setLastSubmittedValues(values);
    await runGeneration(values, values);
  };

  const handleRegenerate = async () => {
    if (!lastSubmittedValues || isStreaming) {
      return;
    }

    await runGeneration(lastSubmittedValues, lastSubmittedValues);
  };

  const handleRefine = async (action) => {
    if (!lastSubmittedValues || !output.trim() || isStreaming) {
      return;
    }

    await runGeneration(
      {
        ...lastSubmittedValues,
        existingOutput: output,
        refineInstruction: action.instruction,
      },
      lastSubmittedValues
    );
  };

  return (
    <div className="page-shell space-y-8">
      <Reveal>
        <SpotlightPanel className="surface-card p-6 lg:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="section-kicker">Generator workspace</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                A hybrid AI studio with a structured builder and a live drafting surface
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                Build a cleaner brief on the left, watch the draft arrive on the right, and keep the refine loop close once the first version lands.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
              <article className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 px-5 py-5 dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Usage</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                  {currentUsage.generationsUsed}/{currentUsage.generationsLimit}
                </p>
                <div className="metric-bar mt-4">
                  <div
                    className="metric-bar-fill"
                    style={{
                      width: `${currentUsage.generationsLimit ? (currentUsage.generationsUsed / currentUsage.generationsLimit) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Clear quota visibility keeps drafting predictable.
                </p>
              </article>
              <article className="rounded-[28px] border border-slate-200/70 bg-slate-50/80 px-5 py-5 dark:border-white/10 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Refine loop</p>
                <p className="mt-3 text-lg font-semibold text-slate-950 dark:text-slate-50">
                  Generate, rewrite, continue, and export from one place.
                </p>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  The workspace is designed to feel iterative, not one-and-done.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
          {generatorTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTypeChange(tab.id)}
              className={classNames(
                'rounded-full px-5 py-3 text-sm font-semibold transition',
                activeType === tab.id
                  ? 'bg-primary text-white shadow-soft dark:bg-sky-300 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
              )}
            >
              {tab.label}
            </button>
          ))}

          {isStreaming ? (
            <button type="button" onClick={handleStopStream} className="btn-secondary">
              Stop streaming
            </button>
          ) : null}
          </div>
        </SpotlightPanel>
      </Reveal>

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <Reveal delay={40}>
          <GeneratorForm type={activeType} onSubmit={handleSubmit} isSubmitting={isStreaming} />
        </Reveal>
        <Reveal delay={90}>
          <OutputBox
            activeType={activeType}
            content={output}
            hasGeneratedDraft={Boolean(lastSubmittedValues)}
            isStreaming={isStreaming}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onRefine={handleRefine}
            onRegenerate={handleRegenerate}
            requestSummary={requestSummary}
            savedGeneration={savedGeneration}
            statusMessage={statusMessage}
          />
        </Reveal>
      </div>

      {showLimitModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="surface-card max-w-md p-7">
            <p className="section-kicker">Usage limit</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
              You've reached your free limit. Upgrade to Pro!
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              The free workspace currently includes 10 generations for the MVP. Pro access can still be unlocked by increasing <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-white/10">generationsLimit</code> in the database until billing is wired in.
            </p>
            <button type="button" onClick={() => setShowLimitModal(false)} className="btn-primary mt-6 w-full">
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
