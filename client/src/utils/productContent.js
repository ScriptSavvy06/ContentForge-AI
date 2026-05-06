export const generatorTabs = [
  {
    id: 'resume',
    label: 'Resume',
    description: 'Craft an ATS-ready resume with stronger positioning, clearer impact, and cleaner structure.',
    eyebrow: 'Career writing',
    benefits: ['ATS-friendly structure', 'Sharper summary', 'Action-driven bullet points'],
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Write persuasive outreach, follow-ups, and proposals that feel confident but still human.',
    eyebrow: 'Professional communication',
    benefits: ['Faster drafts', 'Stronger clarity', 'Tone-conscious delivery'],
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'Generate readable long-form content with clear framing, useful subheads, and stronger flow.',
    eyebrow: 'Content marketing',
    benefits: ['SEO-friendly structure', 'Audience targeting', 'Consistent tone'],
  },
];

export const generatorTemplates = {
  resume: [
    {
      id: 'resume-product',
      label: 'Product role switch',
      description: 'For candidates moving into product, design, or strategy-heavy roles.',
      values: {
        fullName: 'Ava Mitchell',
        jobTitle: 'Product Manager',
        yearsOfExperience: '6 years',
        keySkills: 'Product strategy, roadmap planning, stakeholder alignment, market research, SQL, experimentation',
        workExperience:
          'Led a cross-functional product squad, improved onboarding conversion by 19 percent, launched customer insight loops, and collaborated with design and engineering to prioritize roadmap decisions.',
        stylePreference: 'Executive',
        templateLabel: 'Product role switch',
      },
    },
    {
      id: 'resume-growth',
      label: 'Growth marketer',
      description: 'For marketers who need a sharper performance-focused resume.',
      values: {
        fullName: 'Maya Patel',
        jobTitle: 'Growth Marketing Manager',
        yearsOfExperience: '5 years',
        keySkills: 'Lifecycle campaigns, paid acquisition, CRO, analytics, email automation, content strategy',
        workExperience:
          'Scaled paid and lifecycle programs across two SaaS products, reduced CAC by 18 percent, and launched new experimentation processes that increased qualified pipeline.',
        stylePreference: 'Results-focused',
        templateLabel: 'Growth marketer',
      },
    },
    {
      id: 'resume-fresher',
      label: 'Student or fresher',
      description: 'A strong starting point for students or early-career applicants.',
      values: {
        fullName: 'Riya Sharma',
        jobTitle: 'Software Engineer',
        yearsOfExperience: 'Internships + 1 year',
        keySkills: 'JavaScript, React, Node.js, problem solving, teamwork, REST APIs',
        workExperience:
          'Completed two internships, built a campus project management app, contributed to API integrations, and supported frontend bug fixes and documentation.',
        stylePreference: 'Clear and confident',
        templateLabel: 'Student or fresher',
      },
    },
  ],
  email: [
    {
      id: 'email-outreach',
      label: 'Freelance outreach',
      description: 'Reach out to a prospect with a concise services pitch.',
      values: {
        emailType: 'Cold Outreach',
        recipientRole: 'Founder of a SaaS startup',
        yourName: 'Ava Mitchell',
        contextPurpose:
          'I am a freelance product marketer reaching out to offer positioning and launch support for early-stage SaaS teams. I want the email to feel specific, helpful, and brief.',
        stylePreference: 'Warm and direct',
        templateLabel: 'Freelance outreach',
      },
    },
    {
      id: 'email-followup',
      label: 'Interview follow-up',
      description: 'Send a polished follow-up after a hiring conversation.',
      values: {
        emailType: 'Follow-up',
        recipientRole: 'Hiring Manager',
        yourName: 'Ava Mitchell',
        contextPurpose:
          'Thank the hiring manager after a second-round interview, reinforce interest in the role, and mention one strategic idea from the conversation.',
        stylePreference: 'Professional',
        templateLabel: 'Interview follow-up',
      },
    },
    {
      id: 'email-proposal',
      label: 'Client proposal intro',
      description: 'Frame a proposal email that sounds polished and clear.',
      values: {
        emailType: 'Proposal',
        recipientRole: 'Marketing Director',
        yourName: 'Ava Mitchell',
        contextPurpose:
          'Introduce a proposal for a three-month content strategy project, highlight the problem, the expected outcome, and the collaborative approach.',
        stylePreference: 'Consultative',
        templateLabel: 'Client proposal intro',
      },
    },
  ],
  blog: [
    {
      id: 'blog-startup',
      label: 'Startup growth angle',
      description: 'Write to founders looking for practical leverage.',
      values: {
        blogTopic: 'How AI can reduce busywork for lean startup teams',
        targetAudience: 'Seed-stage SaaS founders',
        tone: 'Professional',
        wordCount: '800',
        stylePreference: 'Insightful',
        templateLabel: 'Startup growth angle',
      },
    },
    {
      id: 'blog-student',
      label: 'Student guide',
      description: 'Educational format for learners and early-career readers.',
      values: {
        blogTopic: 'A practical guide to building a strong portfolio with AI tools',
        targetAudience: 'Students and fresh graduates',
        tone: 'Educational',
        wordCount: '500',
        stylePreference: 'Supportive',
        templateLabel: 'Student guide',
      },
    },
    {
      id: 'blog-marketing',
      label: 'Content strategy piece',
      description: 'Readable marketing content with clearer structure and takeaways.',
      values: {
        blogTopic: 'How to build a content engine that actually supports pipeline',
        targetAudience: 'B2B content marketers',
        tone: 'Persuasive',
        wordCount: '1000',
        stylePreference: 'Strategic',
        templateLabel: 'Content strategy piece',
      },
    },
  ],
};

export const generatorStyleChips = {
  resume: ['Executive', 'Clear and confident', 'Results-focused', 'Minimal'],
  email: ['Warm and direct', 'Professional', 'Consultative', 'Friendly'],
  blog: ['Insightful', 'Educational', 'Strategic', 'Conversational'],
};

export const refineActions = [
  {
    id: 'shorter',
    label: 'Make shorter',
    instruction: 'Rewrite this draft to be shorter, tighter, and easier to skim while preserving the key message.',
  },
  {
    id: 'expand',
    label: 'Expand',
    instruction: 'Expand this draft with more detail, substance, and supporting explanation while keeping it coherent.',
  },
  {
    id: 'professional',
    label: 'More professional',
    instruction: 'Rewrite this draft in a more professional, polished, and credible tone.',
  },
  {
    id: 'friendly',
    label: 'More friendly',
    instruction: 'Rewrite this draft so it sounds warmer, more human, and more approachable.',
  },
  {
    id: 'clearer',
    label: 'Rewrite clearly',
    instruction: 'Rewrite this draft for clarity, stronger flow, and simpler wording without losing the original intent.',
  },
  {
    id: 'continue',
    label: 'Continue writing',
    instruction: 'Continue this draft naturally from where it ends. Keep the same format, tone, and momentum.',
  },
];

export const credibilityAudience = [
  'Job seekers',
  'Freelancers',
  'Founders',
  'Students',
  'Creators',
  'Small teams',
];

export const workflowSteps = [
  {
    step: '01',
    title: 'Prompt with structure',
    description: 'Start with a guided brief instead of an empty box, so every generation begins with stronger context.',
  },
  {
    step: '02',
    title: 'Stream in real time',
    description: 'Watch the response arrive live while the model drafts, edits, and shapes the content in front of you.',
  },
  {
    step: '03',
    title: 'Refine with one click',
    description: 'Shorten, expand, make it friendlier, or continue writing without rebuilding the prompt from scratch.',
  },
  {
    step: '04',
    title: 'Save and reuse',
    description: 'Every completed draft is stored in your personal workspace so you can revisit, pin, and reuse it later.',
  },
];

export const featureGrid = [
  'Real-time streaming output',
  'Personal history and saved drafts',
  'Smart prompt templates',
  'Quick rewriting actions',
  'Usage tracking and limits',
  'Secure personal workspace',
  'Pinned drafts and favorites',
  'Dark mode with persistence',
];

export const landingUseCases = [
  {
    title: 'Students',
    description: 'Build cleaner resumes, cover emails, and first portfolio blog posts without staring at a blank page.',
  },
  {
    title: 'Job seekers',
    description: 'Turn raw experience into stronger applications with clearer positioning, better structure, and sharper messaging.',
  },
  {
    title: 'Freelancers',
    description: 'Draft outreach, proposals, and follow-ups faster so more time goes into actual client work.',
  },
  {
    title: 'Founders',
    description: 'Generate launch updates, hiring outreach, and thought-leadership drafts from one focused workspace.',
  },
  {
    title: 'Marketers and creators',
    description: 'Use structured inputs and AI refinement to ship blog drafts and campaign copy with less friction.',
  },
];

export const faqItems = [
  {
    question: 'How does streaming work?',
    answer:
      'ContentAI streams tokens from the backend so the draft appears progressively instead of waiting for one big response at the end.',
  },
  {
    question: 'Is my content private?',
    answer:
      'Generated drafts are stored in your authenticated workspace and tied to your user account so you can revisit them later.',
  },
  {
    question: 'Which content types are supported?',
    answer:
      'The current product supports resume generation, email writing, and blog post drafting with dedicated structured builders for each.',
  },
  {
    question: 'Is history saved automatically?',
    answer:
      'Yes. Every completed generation is saved to your history so you can view, copy, delete, and pin important drafts.',
  },
  {
    question: 'How do free limits work?',
    answer:
      'Free accounts currently include 10 generations for the MVP. The usage snapshot in your workspace shows how much quota remains.',
  },
];
