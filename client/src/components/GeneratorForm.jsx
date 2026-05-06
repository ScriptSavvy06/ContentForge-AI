import { useEffect, useMemo, useState } from 'react';

import {
  blogTones,
  blogWordCounts,
  classNames,
  emailTypes,
  generatorStyleChips,
  generatorTabs,
  generatorTemplates,
} from '../utils/helpers';

const formConfigs = {
  resume: {
    heading: 'Resume workspace',
    description:
      'Shape a stronger professional narrative with structured details, a starter template, and a preferred writing style.',
    helperCard: 'Best for role changes, promotion-focused updates, and ATS-friendly resumes.',
    sections: [
      {
        title: 'Core details',
        description: 'These fields anchor the resume summary and top-level positioning.',
        fields: [
          { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Ava Mitchell' },
          { name: 'jobTitle', label: 'Target Job Title', type: 'text', placeholder: 'Senior Product Designer' },
          {
            name: 'yearsOfExperience',
            label: 'Years of Experience',
            type: 'text',
            placeholder: '6 years',
          },
        ],
      },
      {
        title: 'Experience inputs',
        description: 'Include your strongest skills, wins, and responsibilities.',
        fields: [
          {
            name: 'keySkills',
            label: 'Key Skills',
            type: 'textarea',
            placeholder: 'UX research, prototyping, design systems, stakeholder management...',
          },
          {
            name: 'workExperience',
            label: 'Work Experience',
            type: 'textarea',
            placeholder: 'Summarize your most relevant experience, outcomes, and responsibilities.',
          },
        ],
      },
    ],
    initialValues: {
      fullName: '',
      jobTitle: '',
      yearsOfExperience: '',
      keySkills: '',
      workExperience: '',
      stylePreference: '',
      templateLabel: '',
    },
  },
  email: {
    heading: 'Email workspace',
    description:
      'Choose the type of email, define the context, and let ContentAI draft something concise and sendable.',
    helperCard: 'Helpful for outreach, interview follow-ups, thank-you notes, and proposals.',
    sections: [
      {
        title: 'Message setup',
        description: 'Start with the email type and audience details.',
        fields: [
          {
            name: 'emailType',
            label: 'Email Type',
            type: 'select',
            options: emailTypes,
          },
          { name: 'recipientRole', label: 'Recipient Role', type: 'text', placeholder: 'Hiring Manager' },
          { name: 'yourName', label: 'Your Name', type: 'text', placeholder: 'Ava Mitchell' },
        ],
      },
      {
        title: 'Context and intent',
        description: 'Explain what the email should accomplish and any nuance worth carrying through.',
        fields: [
          {
            name: 'contextPurpose',
            label: 'Context / Purpose',
            type: 'textarea',
            placeholder: 'Describe the context, intent, and tone you want from the final message.',
          },
        ],
      },
    ],
    initialValues: {
      emailType: emailTypes[0],
      recipientRole: '',
      yourName: '',
      contextPurpose: '',
      stylePreference: '',
      templateLabel: '',
    },
  },
  blog: {
    heading: 'Blog workspace',
    description:
      'Build a better long-form brief with audience, tone, and structure already baked into the request.',
    helperCard: 'Useful for educational posts, thought leadership, and practical SEO content drafts.',
    sections: [
      {
        title: 'Content brief',
        description: 'Define the topic and the audience you want to reach.',
        fields: [
          { name: 'blogTopic', label: 'Blog Topic', type: 'text', placeholder: 'How AI can reduce busywork for lean startup teams' },
          {
            name: 'targetAudience',
            label: 'Target Audience',
            type: 'text',
            placeholder: 'Seed-stage SaaS founders',
          },
        ],
      },
      {
        title: 'Voice and output',
        description: 'Choose the tone and desired length before the model starts writing.',
        fields: [
          {
            name: 'tone',
            label: 'Tone',
            type: 'select',
            options: blogTones,
          },
          {
            name: 'wordCount',
            label: 'Word Count',
            type: 'select',
            options: blogWordCounts,
          },
        ],
      },
    ],
    initialValues: {
      blogTopic: '',
      targetAudience: '',
      tone: blogTones[0],
      wordCount: blogWordCounts[1],
      stylePreference: '',
      templateLabel: '',
    },
  },
};

function cloneFormValues(type) {
  return { ...formConfigs[type].initialValues };
}

function createSectionState(type) {
  return formConfigs[type].sections.reduce(
    (accumulator, section) => ({
      ...accumulator,
      [section.title]: true,
    }),
    {}
  );
}

function validateForm(type, values) {
  const config = formConfigs[type];
  const errors = {};

  config.sections.forEach((section) => {
    section.fields.forEach((field) => {
      if (!String(values[field.name] || '').trim()) {
        errors[field.name] = `${field.label} is required.`;
      }
    });
  });

  return errors;
}

function FieldRenderer({ field, value, error, handleChange }) {
  if (field.type === 'textarea') {
    return (
      <div key={field.name}>
        <label className="field-label" htmlFor={field.name}>
          {field.label}
        </label>
        <textarea
          id={field.name}
          name={field.name}
          rows={6}
          value={value}
          onChange={handleChange}
          className="field-input min-h-[150px] resize-y"
          placeholder={field.placeholder}
        />
        {error ? <p className="field-error">{error}</p> : null}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div key={field.name}>
        <label className="field-label" htmlFor={field.name}>
          {field.label}
        </label>
        <select
          id={field.name}
          name={field.name}
          value={value}
          onChange={handleChange}
          className="field-input"
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error ? <p className="field-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div key={field.name}>
      <label className="field-label" htmlFor={field.name}>
        {field.label}
      </label>
      <input
        id={field.name}
        name={field.name}
        type="text"
        value={value}
        onChange={handleChange}
        className="field-input"
        placeholder={field.placeholder}
      />
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

export default function GeneratorForm({ type, onSubmit, isSubmitting }) {
  const [formValues, setFormValues] = useState(cloneFormValues(type));
  const [errors, setErrors] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [openSections, setOpenSections] = useState(createSectionState(type));

  const activeConfig = formConfigs[type];
  const activeMeta = useMemo(() => generatorTabs.find((tab) => tab.id === type), [type]);
  const activeTemplates = generatorTemplates[type];
  const styleChips = generatorStyleChips[type];

  useEffect(() => {
    setFormValues(cloneFormValues(type));
    setErrors({});
    setSelectedTemplateId('');
    setOpenSections(createSectionState(type));
  }, [type]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  };

  const applyTemplate = (template) => {
    setSelectedTemplateId(template.id);
    setFormValues((currentValues) => ({
      ...currentValues,
      ...template.values,
      templateLabel: template.label,
    }));
  };

  const handleStylePreference = (style) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      stylePreference: currentValues.stylePreference === style ? '' : style,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(type, formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formValues);
  };

  const toggleSection = (sectionTitle) => {
    setOpenSections((currentValue) => ({
      ...currentValue,
      [sectionTitle]: !currentValue[sectionTitle],
    }));
  };

  return (
    <section className="surface-card p-6 lg:p-7 xl:sticky xl:top-28">
      <div className="flex flex-col gap-6 border-b border-slate-200/70 pb-6 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="section-kicker">{activeMeta?.eyebrow}</span>
          <span className="premium-pill">
            {activeTemplates.length} starter templates
          </span>
          <span className="premium-pill">
            Live streaming enabled
          </span>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">{activeConfig.heading}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            {activeConfig.description}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card-muted p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Why this builder is structured this way</p>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {activeConfig.helperCard}
            </p>
          </div>
          <div className="surface-card-muted p-4">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">What happens next</p>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Fill the brief, choose a style cue if helpful, then stream the draft into the workspace and refine from there.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Starter templates</p>
            <p className="field-helper">Jump in with a practical starting point, then reshape the brief as needed.</p>
          </div>
          {selectedTemplateId ? (
            <span className="premium-pill">
              Template applied
            </span>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3">
          {activeTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => applyTemplate(template)}
              className={classNames(
                'rounded-[26px] border px-4 py-4 text-left transition duration-300',
                selectedTemplateId === template.id
                  ? 'border-primary bg-primary/5 shadow-soft dark:border-sky-300 dark:bg-sky-300/10'
                  : 'border-slate-200/80 bg-white/75 hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/65 dark:hover:border-white/20'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-950 dark:text-slate-50">{template.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {template.description}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {selectedTemplateId === template.id ? 'Applied' : 'Apply'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {activeConfig.sections.map((section, index) => {
          const isOpen = openSections[section.title];

          return (
            <section key={section.title} className="rounded-[28px] border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-slate-900/55">
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <div>
                  <p className="section-kicker">
                    {index === 0 ? 'Strategy and brief' : 'Context and detail'}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">{section.title}</p>
                  <p className="field-helper">{section.description}</p>
                </div>
                <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 bg-white/80 text-slate-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
                  <svg
                    viewBox="0 0 24 24"
                    className={classNames('h-5 w-5 transition duration-300', isOpen ? 'rotate-180' : '')}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M7 10L12 15L17 10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>

              <div className={classNames('grid transition-all duration-300', isOpen ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                <div className="overflow-hidden">
                  <div className="grid gap-5 md:grid-cols-2">
                    {section.fields.map((field) => (
                      <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                        <FieldRenderer
                          field={field}
                          value={formValues[field.name]}
                          error={errors[field.name]}
                          handleChange={handleChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <section className="rounded-[28px] border border-slate-200/70 bg-white/75 p-5 dark:border-white/10 dark:bg-slate-950/55">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Style and tone</p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">Guide the voice of the draft</p>
              <p className="field-helper">Optional, but useful when you want the result to feel more intentional from the first stream.</p>
            </div>
            {formValues.stylePreference ? <span className="premium-pill">{formValues.stylePreference}</span> : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {styleChips.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => handleStylePreference(style)}
                className={classNames(
                  'rounded-full px-4 py-2 text-sm font-medium transition duration-300',
                  formValues.stylePreference === style
                    ? 'bg-primary text-white dark:bg-sky-300 dark:text-slate-950'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/70 bg-white/75 p-5 dark:border-white/10 dark:bg-slate-950/55">
          <p className="section-kicker">Output settings</p>
          <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">Workspace behavior</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Streaming response</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                The draft appears progressively in the workspace so progress stays visible while the model writes.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">History save</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Completed drafts are saved automatically, which keeps copy, export, pinning, and later reuse close by.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/70 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/60 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Generate your next draft</p>
            <p className="field-helper">The current brief will stream into the AI workspace, save to history, and stay ready for quick refinements.</p>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[220px]">
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <span className="spinner" />
                Generating...
              </span>
            ) : (
              `Generate ${activeMeta?.label}`
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
