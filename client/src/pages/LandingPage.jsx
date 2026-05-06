import { useState } from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Reveal from '../components/Reveal';
import SpotlightPanel from '../components/SpotlightPanel';
import { useAuth } from '../context/AuthContext';
import {
  credibilityAudience,
  faqItems,
  generatorTabs,
  landingUseCases,
  workflowSteps,
} from '../utils/productContent';

const heroSignals = [
  'Prompt with structure',
  'Stream with visible progress',
  'Refine without starting over',
  'Save useful work automatically',
];

const trustStats = [
  {
    value: '3',
    label: 'Focused generators',
    detail: 'Resume, email, and blog workflows built around real recurring tasks.',
  },
  {
    value: 'Live',
    label: 'Streaming response',
    detail: 'Drafts appear progressively so the product feels responsive while it thinks.',
  },
  {
    value: 'Private',
    label: 'Workspace history',
    detail: 'Completed generations stay tied to the authenticated user experience.',
  },
];

const featureDetails = [
  {
    title: 'Real-time streaming',
    description: 'Response tokens arrive progressively, which makes the writing loop feel alive instead of hidden.',
  },
  {
    title: 'Personal history',
    description: 'Completed drafts stay searchable, exportable, and easy to revisit inside the private workspace.',
  },
  {
    title: 'Smart prompt templates',
    description: 'Strong starting points reduce setup friction while still keeping the user in control.',
  },
  {
    title: 'Quick rewriting',
    description: 'Shorten, expand, clarify, continue, or shift tone without rebuilding the original brief.',
  },
  {
    title: 'Usage tracking',
    description: 'Quota visibility stays clear, calm, and visible in the moments where it matters.',
  },
  {
    title: 'Secure workspace',
    description: 'The product moves from marketing to a personal workspace the moment a user signs in.',
  },
  {
    title: 'Pinned drafts',
    description: 'Important output can stay surfaced for fast retrieval during real work sessions.',
  },
  {
    title: 'Theme support',
    description: 'Both light and dark mode are intentionally designed for long writing sessions.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    badge: 'Available now',
    description: 'A focused personal workspace for trying the full product loop end to end.',
    features: [
      '10 monthly generations',
      'Resume, email, and blog workflows',
      'Streaming output and refine actions',
      'Saved history, pinning, and export text',
    ],
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$19',
    badge: 'Coming soon',
    description: 'Prepared for heavier weekly usage, richer preferences, and higher individual throughput.',
    features: [
      'Expanded generation limits',
      'Longer drafting sessions',
      'More workspace controls',
      'Priority future upgrades',
    ],
  },
  {
    name: 'Team',
    price: '$49',
    badge: 'Coming soon',
    description: 'Designed for collaborative content operations once sharing and workspace controls expand.',
    features: [
      'Shared team workspace',
      'Admin and plan controls',
      'Higher usage ceilings',
      'Team-ready workflow features',
    ],
  },
];

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Workflow', href: '#workflow' },
      { label: 'Generators', href: '#generators' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact placeholder', href: '#' },
      { label: 'GitHub placeholder', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy placeholder', href: '#' },
      { label: 'Terms placeholder', href: '#' },
      { label: 'Security placeholder', href: '#' },
    ],
  },
];

function Icon({ type, className = 'h-5 w-5' }) {
  if (type === 'spark') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3.5L14.7 9.3L20.5 12L14.7 14.7L12 20.5L9.3 14.7L3.5 12L9.3 9.3L12 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'layers') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 4L21 9L12 14L3 9L12 4Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 13L12 18L21 13" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17L12 22L21 17" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'shield') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3L19 6V11.5C19 16 15.8 20 12 21C8.2 20 5 16 5 11.5V6L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 12.5L11.2 14.2L14.9 10.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'wand') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 20L14.5 9.5" strokeLinecap="round" />
        <path d="M13 4.5L14 6.5L16 7.5L14 8.5L13 10.5L12 8.5L10 7.5L12 6.5L13 4.5Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 12L18.1 13.4L19.5 14L18.1 14.6L17.5 16L16.9 14.6L15.5 14L16.9 13.4L17.5 12Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12.5L9.5 17L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="surface-card-muted overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{item.question}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isOpen ? 'Collapse answer' : 'Open answer'}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100">
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 transition duration-300 ${isOpen ? 'rotate-45' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 5V19M5 12H19" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden px-6 pb-5">
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="page-shell min-h-screen">
      <Navbar />

      <main className="overflow-hidden">
        <section className="mx-auto max-w-7xl px-6 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <Reveal className="max-w-2xl">
              <div className="premium-pill w-fit">
                <span className="floating-sheen h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Premium AI drafting for resumes, emails, and blog posts
              </div>
              <h1 className="mt-8 text-5xl font-semibold leading-[0.95] text-slate-950 dark:text-slate-50 sm:text-6xl lg:text-7xl">
                Structured AI writing that feels more like a product than a prompt box.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                ContentAI combines guided briefs, live streaming output, one-click refinements, private history, and a calmer workspace so the whole drafting loop feels sharper from the first input to the saved result.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn-primary min-w-[210px]">
                  {isAuthenticated ? 'Open my workspace' : 'Start free workspace'}
                </Link>
                <a href="#workflow" className="btn-secondary min-w-[190px]">
                  See the workflow
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {heroSignals.map((item) => (
                  <span key={item} className="premium-pill">
                    <Icon type="spark" className="h-4 w-4" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {trustStats.map((item) => (
                  <article key={item.label} className="surface-card-muted p-5">
                    <p className="text-3xl font-semibold text-slate-950 dark:text-slate-50">{item.value}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <SpotlightPanel intensity="high" className="glass-panel p-4 lg:p-5">
                <div className="surface-card overflow-hidden rounded-[30px] p-0">
                  <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/85 px-5 py-4 dark:border-white/10 dark:bg-slate-950/80">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">ContentAI drafting studio</span>
                    </div>
                    <span className="premium-pill bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                      Streaming live
                    </span>
                  </div>

                  <div className="grid gap-0 lg:grid-cols-[0.43fr_0.57fr]">
                    <div className="bg-slate-950/95 p-6 text-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="section-kicker text-sky-300">Prompt builder</p>
                          <h2 className="mt-3 text-2xl font-semibold text-white">Resume generator</h2>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                          ATS ready
                        </span>
                      </div>

                      <div className="mt-6 space-y-4">
                        {[
                          ['Strategy', 'Senior product designer repositioning for a growth-stage SaaS role.'],
                          ['Style cues', 'Executive, clean bullets, impact-first.'],
                          ['Output settings', 'Headline, summary, impact bullets, and auto-save on completion.'],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
                            <p className="mt-3 text-sm leading-7 text-slate-300">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-5 dark:bg-slate-950">
                      <div className="workspace-canvas p-5">
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                          <div>
                            <p className="text-sm font-semibold text-sky-300">AI workspace</p>
                            <p className="mt-1 text-xl font-semibold text-white">Prompt to Stream to Refine to Save</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
                            <p className="text-sm text-slate-200">Drafting experience bullets</p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-[28px] bg-white/95 px-5 py-5 shadow-soft dark:bg-slate-950/80">
                          <div className="space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-200">
                            <p>
                              <span className="font-semibold text-slate-950 dark:text-white">Summary:</span> Product designer with 6+ years shaping onboarding, design systems, and cross-functional product delivery for growth-stage SaaS teams.
                            </p>
                            <p>
                              <span className="font-semibold text-slate-950 dark:text-white">Impact:</span> Led a redesign that lifted activation by 19%, created reusable components adopted across three squads, and simplified high-friction flows with product leadership.
                              <span className="typing-cursor" />
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {['Make shorter', 'More professional', 'Continue writing', 'Save to history'].map((action) => (
                            <span key={action} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightPanel>
            </Reveal>
          </div>
        </section>

        <Reveal as="section" className="border-y border-slate-200/70 bg-white/55 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-6 lg:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Built for modern work</span>
            {credibilityAudience.map((item) => (
              <span key={item} className="premium-pill">
                {item}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal id="workflow" as="section" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="section-kicker">Workflow</p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
                A product flow that reduces blank-page friction at every step.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
                ContentAI is deliberately opinionated about the drafting journey: collect the right inputs, make progress visible, invite focused refinements, and keep useful work easy to recover later.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {workflowSteps.map((item, index) => (
                <Reveal key={item.step} delay={index * 70}>
                  <SpotlightPanel className="surface-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="section-kicker">{item.step}</p>
                        <h3 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-slate-50">{item.title}</h3>
                      </div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-sky-400/10 dark:text-sky-300">
                        <Icon type={index % 2 === 0 ? 'layers' : 'spark'} />
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">{item.description}</p>
                  </SpotlightPanel>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <section id="generators" className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
          <SpotlightPanel className="glass-panel p-8 lg:p-10">
            <Reveal>
              <div className="max-w-2xl">
                <p className="section-kicker">Core generators</p>
                <h2 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
                  Three focused workflows for the writing tasks people repeat every week.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                  Each workspace keeps structure where it helps most, so the product feels faster, more legible, and more reusable than a generic all-purpose prompt flow.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
              <Reveal delay={80}>
                <SpotlightPanel className="surface-card-strong p-7 lg:p-8">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Flagship workflow</p>
                      <h3 className="mt-3 text-3xl font-semibold text-white">Resume generator</h3>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-blue-100">
                      Structured prompt builder
                    </span>
                  </div>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100">
                    Built for sharper positioning, better summaries, and impact-led bullets that are easier to tailor for specific applications and easier to refine after the first draft.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {['Narrative clarity', 'ATS-aware structure', 'Faster rewrites'].map((item) => (
                      <div key={item} className="rounded-[24px] bg-white/10 px-4 py-4 text-sm text-blue-100">
                        {item}
                      </div>
                    ))}
                  </div>
                </SpotlightPanel>
              </Reveal>

              <div className="grid gap-5">
                {generatorTabs
                  .filter((item) => item.id !== 'resume')
                  .map((item, index) => (
                    <Reveal key={item.id} delay={120 + index * 60}>
                      <SpotlightPanel className="surface-card p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="section-kicker">{item.eyebrow}</p>
                            <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                              {item.label}
                            </h3>
                          </div>
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-sky-400/10 dark:text-sky-300">
                            <Icon type={item.id === 'email' ? 'wand' : 'layers'} />
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {item.benefits.map((benefit) => (
                            <span key={benefit} className="premium-pill">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </SpotlightPanel>
                    </Reveal>
                  ))}
              </div>
            </div>
          </SpotlightPanel>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <Reveal>
              <div className="surface-card p-8">
                <p className="section-kicker">Interactive demo</p>
                <h2 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
                  An AI drafting surface with visible momentum.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                  The experience is designed to feel intelligent without becoming noisy: subtle state changes, a live cursor, and quick follow-up actions that keep you moving.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {['Cold outreach', 'Founder update', 'Portfolio intro', 'SEO section', 'Follow-up note'].map((chip) => (
                    <span key={chip} className="premium-pill">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <SpotlightPanel className="workspace-canvas p-6 lg:p-7">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-sky-300">AI live demo</p>
                    <p className="mt-1 text-2xl font-semibold text-white">Prompt to polished output</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                    <span className="floating-sheen h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    Drafting
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="ml-auto max-w-xl rounded-[28px] border border-white/10 bg-white/5 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Prompt</p>
                    <p className="mt-3 text-sm leading-7 text-slate-200">
                      Write a concise founder follow-up email after a product marketing consultation. Keep it warm, clear, and action-oriented, then suggest the next step naturally.
                    </p>
                  </div>

                  <div className="rounded-[30px] bg-white/95 px-5 py-5 shadow-soft dark:bg-slate-950/80">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">ContentAI response</p>
                    <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                      <p>Hi Elena,</p>
                      <p>
                        Thanks again for the conversation today. I enjoyed unpacking the gap between acquisition and activation in the onboarding experience.
                      </p>
                      <p>
                        I attached a short recap with the three highest-leverage experiments we discussed, along with a simple first test you could run this week to validate the positioning change.
                        <span className="typing-cursor" />
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['Shorter', 'More friendly', 'Continue writing', 'Copy draft'].map((action) => (
                      <span key={action} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightPanel>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-10">
          <Reveal className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featureDetails.map((item, index) => (
              <SpotlightPanel key={item.title} className="surface-card p-6" intensity={index === 0 ? 'high' : 'medium'}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-sky-400/10 dark:text-sky-300">
                  <Icon type={index % 3 === 0 ? 'spark' : index % 3 === 1 ? 'layers' : 'shield'} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-slate-50">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{item.description}</p>
              </SpotlightPanel>
            ))}
          </Reveal>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Reveal>
            <div className="grid gap-5 lg:grid-cols-5">
              {landingUseCases.map((item, index) => (
                <SpotlightPanel key={item.title} className="surface-card p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="section-kicker">{item.title}</p>
                    <span className="text-primary dark:text-sky-300">
                      <Icon type={index % 2 === 0 ? 'spark' : 'wand'} className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                </SpotlightPanel>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
          <Reveal>
            <div className="surface-card overflow-hidden p-0">
              <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
                <SpotlightPanel className="surface-card-strong rounded-none border-0 p-8 lg:p-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">After login</p>
                  <h2 className="mt-4 text-4xl font-semibold text-white">
                    The product shifts from polished marketing to a personal AI workspace.
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-8 text-blue-100">
                    Once signed in, the public story disappears and the product turns into your private content system: usage visibility, recent activity, pinned drafts, history, and a faster route back into the next useful draft.
                  </p>
                </SpotlightPanel>

                <div className="grid gap-5 p-8 lg:grid-cols-2 lg:p-10">
                  {[
                    ['Dashboard overview', 'Usage, quick actions, recent outputs, and a calm sense of where your work stands.'],
                    ['Hybrid generator', 'Structured inputs on one side and a premium AI drafting surface on the other.'],
                    ['Searchable history', 'Saved output stays easy to find, pin, export, and revisit when needed.'],
                    ['Preferences-ready shell', 'Theme and workspace habits live in a clean future-ready settings space.'],
                  ].map(([title, description]) => (
                    <SpotlightPanel key={title} className="surface-card-muted p-5">
                      <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">{title}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
                    </SpotlightPanel>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="section-kicker">Pricing</p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
                Start free today, with room for the product to grow into Pro and Team.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                The current experience is fully usable on the free plan. Pro and Team are presented as future-ready directions so the product reads like a serious SaaS offering without pretending those tiers are live.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Reveal key={plan.name} delay={index * 70}>
                <SpotlightPanel className={plan.highlighted ? 'surface-card-strong p-7' : 'surface-card p-7'} intensity={plan.highlighted ? 'high' : 'medium'}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={plan.highlighted ? 'text-sm font-semibold uppercase tracking-[0.18em] text-blue-100' : 'section-kicker'}>
                        {plan.badge}
                      </p>
                      <h3 className={`mt-4 text-3xl font-semibold ${plan.highlighted ? 'text-white' : 'text-slate-950 dark:text-slate-50'}`}>
                        {plan.name}
                      </h3>
                    </div>
                    <p className={`text-4xl font-semibold ${plan.highlighted ? 'text-white' : 'text-slate-950 dark:text-slate-50'}`}>
                      {plan.price}
                      <span className={`ml-1 text-sm font-medium ${plan.highlighted ? 'text-blue-100' : 'text-slate-400'}`}>/mo</span>
                    </p>
                  </div>

                  <p className={`mt-5 text-sm leading-7 ${plan.highlighted ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {plan.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className={`flex items-start gap-3 rounded-[22px] px-4 py-3 ${
                          plan.highlighted
                            ? 'bg-white/10 text-blue-100'
                            : 'border border-slate-200/70 bg-slate-50/80 text-slate-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300'
                        }`}
                      >
                        <span className={plan.highlighted ? 'text-white' : 'text-primary dark:text-sky-300'}>
                          <Icon type="check" className="mt-1 h-4 w-4" />
                        </span>
                        <span className="text-sm leading-6">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.highlighted ? (
                    <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn-secondary mt-8 w-full">
                      {isAuthenticated ? 'Open workspace' : 'Create free account'}
                    </Link>
                  ) : (
                    <button type="button" className="btn-secondary mt-8 w-full" disabled>
                      Coming soon
                    </button>
                  )}
                </SpotlightPanel>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="section-kicker">FAQ</p>
              <h2 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-slate-50">
                Answers people usually want before trusting an AI writing workspace.
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqItems.map((item, index) => (
              <Reveal key={item.question} delay={index * 40}>
                <FaqItem item={item} isOpen={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? -1 : index)} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-24">
          <Reveal>
            <SpotlightPanel intensity="high" className="surface-card-strong overflow-hidden p-8 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_0.66fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Final CTA</p>
                  <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white lg:text-5xl">
                    Better first drafts feel different when the whole workspace is built to help you keep going.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100">
                    ContentAI is for people who want structure, speed, saved context, and a calmer AI product that supports real work instead of forcing every task through the same blank interface.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn-secondary w-full">
                    {isAuthenticated ? 'Open my workspace' : 'Get started free'}
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-3 text-center font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            </SpotlightPanel>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[0.9fr_0.35fr_0.35fr_0.35fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <img src="/brand-mark.svg" alt="ContentAI" className="h-11 w-11 rounded-2xl shadow-soft" />
              <div>
                <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">ContentAI</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Structured AI drafting for real work</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              A premium-feeling AI workspace for resumes, emails, and blog posts with real authentication, saved history, refine loops, and theme-aware personal productivity surfaces.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{column.title}</p>
              <div className="mt-4 space-y-3">
                {column.links.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
