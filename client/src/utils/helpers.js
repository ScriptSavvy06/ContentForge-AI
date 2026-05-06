export {
  generatorTabs,
  generatorTemplates,
  generatorStyleChips,
  refineActions,
} from './productContent';

import { generatorTabs } from './productContent';

export const emailTypes = ['Cold Outreach', 'Follow-up', 'Thank You', 'Proposal'];
export const blogTones = ['Professional', 'Casual', 'Persuasive', 'Educational'];
export const blogWordCounts = ['300', '500', '800', '1000'];

export const typeLabels = {
  resume: 'Resume',
  email: 'Email',
  blog: 'Blog',
};

export const typeBadgeClasses = {
  resume: 'bg-accent/10 text-primary',
  email: 'bg-emerald-100 text-emerald-700',
  blog: 'bg-amber-100 text-amber-700',
};

export function formatDate(dateValue) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
}

export function truncateText(text, maxLength = 120) {
  const value = String(text || '').trim();

  if (!value) {
    return '';
  }

  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatPlan(plan) {
  return plan === 'pro' ? 'Pro' : 'Free';
}

export function formatRelativeTime(dateValue) {
  const date = new Date(dateValue).getTime();
  const now = Date.now();
  const differenceInMinutes = Math.max(1, Math.round((now - date) / 60000));

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m ago`;
  }

  const differenceInHours = Math.round(differenceInMinutes / 60);

  if (differenceInHours < 24) {
    return `${differenceInHours}h ago`;
  }

  const differenceInDays = Math.round(differenceInHours / 24);
  return `${differenceInDays}d ago`;
}

export function buildGenerationSummary(type, values) {
  if (!values) {
    return '';
  }

  if (type === 'resume') {
    return `${values.fullName || 'Candidate'} applying for ${values.jobTitle || 'a new role'} with ${values.yearsOfExperience || 'relevant'} experience.`;
  }

  if (type === 'email') {
    return `${values.emailType || 'Email'} for a ${values.recipientRole || 'recipient'} from ${values.yourName || 'the sender'}.`;
  }

  return `${values.blogTopic || 'Blog draft'} for ${values.targetAudience || 'a target audience'} in a ${values.tone || 'clear'} tone.`;
}

export function buildDownloadFilename(label, extension = 'txt') {
  const slug = String(label || 'contentai-draft')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);

  return `${slug || 'contentai-draft'}.${extension}`;
}

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}
