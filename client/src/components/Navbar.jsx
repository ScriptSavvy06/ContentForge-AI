import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const publicLinks = [
    { href: '#workflow', label: 'Workflow' },
    { href: '#generators', label: 'Generators' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/72 backdrop-blur-2xl transition dark:border-white/10 dark:bg-slate-950/72">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/brand-mark.svg"
            alt="ContentAI"
            className="h-11 w-11 rounded-2xl shadow-soft"
          />
          <div>
            <p className="font-heading text-lg font-semibold text-night dark:text-slate-50">ContentAI</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Structured AI drafting for real work</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {isLandingPage && !isAuthenticated ? (
            <>
              {publicLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-sky-300"
                >
                  {item.label}
                </a>
              ))}
            </>
          ) : null}

          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-sky-300"
              >
                Dashboard
              </Link>
              <Link
                to="/generate"
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-sky-300"
              >
                Generate
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary">
                Log Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white/70 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-sky-300"
              >
                Log In
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2.5">
                Get Started Free
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle compact />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-100"
            aria-label="Toggle navigation menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              {isMobileMenuOpen ? (
                <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7H20M4 12H20M4 17H15" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-slate-200/70 bg-white/90 px-6 transition-all duration-300 dark:border-white/10 dark:bg-slate-950/95 md:hidden ${
          isMobileMenuOpen ? 'max-h-[420px] py-5' : 'max-h-0 py-0'
        }`}
      >
        <div className="space-y-3">
          {isLandingPage && !isAuthenticated
            ? publicLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200"
                >
                  {item.label}
                </a>
              ))
            : null}

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200"
              >
                Dashboard
              </Link>
              <Link
                to="/generate"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200"
              >
                Generate
              </Link>
              <button type="button" onClick={handleLogout} className="btn-secondary w-full">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary w-full">
                Log In
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
