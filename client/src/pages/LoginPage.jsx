import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Reveal from '../components/Reveal';
import SpotlightPanel from '../components/SpotlightPanel';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

function validateLogin(values) {
  const errors = {};

  if (!String(values.email || '').trim()) {
    errors.email = 'Email is required.';
  }

  if (!String(values.password || '').trim()) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="surface-card flex items-center gap-3 px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className="spinner-dark" />
          Loading session...
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
    const validationErrors = validateLogin(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formValues);
      toast.success('Welcome back to ContentAI.');
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login page error:', error);
      toast.error(getErrorMessage(error, 'Unable to log in right now.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell min-h-screen">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-16 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="hidden lg:block">
            <SpotlightPanel className="surface-card-strong rounded-[36px] p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Welcome back</p>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-white">
              Return to your personal AI drafting workspace.
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-blue-100">
              Continue generating polished drafts, revisit saved history, and pick up from the prompts that were already working for you.
            </p>

            <div className="mt-10 space-y-4">
              {[
                'Resume, email, and blog generators with live streaming',
                'Saved history with copy, export, and pinned drafts',
                'A private workspace that feels more like a product than a form',
              ].map((item) => (
                <div key={item} className="rounded-[24px] bg-white/10 px-5 py-4 text-sm leading-7 text-blue-100">
                  {item}
                </div>
              ))}
            </div>
            </SpotlightPanel>
          </Reveal>

          <Reveal delay={70}>
            <section className="surface-card mx-auto w-full max-w-xl p-8 lg:p-10">
            <p className="section-kicker">Login</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50">Sign in to your workspace</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Access saved drafts, pinned history, usage visibility, and the upgraded hybrid generator experience.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                  placeholder="Enter your password"
                />
                {errors.password ? <p className="field-error">{errors.password}</p> : null}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <span className="spinner" />
                    Logging in...
                  </span>
                ) : (
                  'Enter workspace'
                )}
              </button>
            </form>

            <div className="mt-8 rounded-[28px] border border-slate-200/70 bg-slate-50/80 px-5 py-4 dark:border-white/10 dark:bg-slate-900/65">
              <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">
                Need an account?{' '}
                <Link to="/register" className="font-semibold text-primary dark:text-sky-300">
                  Create one for free
                </Link>
              </p>
            </div>
            </section>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
