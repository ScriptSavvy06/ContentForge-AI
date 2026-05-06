import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Reveal from '../components/Reveal';
import SpotlightPanel from '../components/SpotlightPanel';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

function validateRegistration(values) {
  const errors = {};

  if (!String(values.name || '').trim()) {
    errors.name = 'Name is required.';
  }

  if (!String(values.email || '').trim()) {
    errors.email = 'Email is required.';
  }

  if (!String(values.password || '').trim()) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="surface-card flex items-center gap-3 px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="spinner-dark" />
          Preparing your workspace...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateRegistration(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await register(formValues);
      toast.success('Your workspace is ready. Welcome to ContentAI.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Register page error:', error);
      toast.error(getErrorMessage(error, 'Unable to create your account right now.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell min-h-screen">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-16 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.95fr]">
          <Reveal>
            <section className="surface-card mx-auto w-full max-w-xl p-8 lg:p-10">
            <p className="section-kicker">Register</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">Start your AI content workspace</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Create your account to unlock the upgraded generator studio, saved history, dark mode, and your free monthly drafting quota.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="field-label">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="Ava Mitchell"
                />
                {errors.name ? <p className="field-error">{errors.name}</p> : null}
              </div>

              <div>
                <label htmlFor="email" className="field-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="you@example.com"
                />
                {errors.email ? <p className="field-error">{errors.email}</p> : null}
              </div>

              <div>
                <label htmlFor="password" className="field-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="Create a secure password"
                />
                {errors.password ? <p className="field-error">{errors.password}</p> : null}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <span className="spinner" />
                    Creating account...
                  </span>
                ) : (
                  'Create free workspace'
                )}
              </button>
            </form>

            <div className="mt-8 rounded-[28px] border border-slate-200/70 bg-slate-50/80 px-5 py-4 dark:border-white/10 dark:bg-slate-900/65">
              <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary dark:text-sky-300">
                  Sign in here
                </Link>
              </p>
            </div>
            </section>
          </Reveal>

          <Reveal delay={70} className="hidden lg:block">
            <SpotlightPanel className="surface-card-strong rounded-[36px] p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">What you get</p>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-white">
              A focused AI product for the writing tasks people repeat every week.
            </h1>
            <div className="mt-8 space-y-4">
              {[
                'Structured generators for resumes, emails, and blog posts',
                'Real-time streaming with a more alive drafting feel',
                'Saved history, pinned drafts, export text, and usage snapshots',
              ].map((item) => (
                <div key={item} className="rounded-[24px] bg-white/10 px-5 py-4 text-sm leading-7 text-blue-100">
                  {item}
                </div>
              ))}
            </div>
            </SpotlightPanel>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
