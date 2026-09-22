import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    setErrorMsg(null);
    login(email, fullName || undefined);
  };

  const handleDemoSignIn = () => {
    login('onyiokolie3@gmail.com', 'Onyi Okolie');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        className="surface-card auth-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2rem',
          background: '#ffffff',
          position: 'relative',
          borderRadius: '1rem',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <button
          type="button"
          className="icon-btn"
          onClick={closeAuthModal}
          aria-label="Close authentication dialog"
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          <X size={18} />
        </button>

        <h1 className="page-title" style={{ margin: '0 0 0.35rem', fontSize: '1.5rem', fontWeight: 800 }}>
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="muted" style={{ margin: '0 0 1.25rem', fontSize: '.88rem', lineHeight: 1.5 }}>
          Orders and service requests are private to your account (enforced by row-level security).
        </p>

        {errorMsg && (
          <p className="banner banner--error" role="alert" style={{ marginBottom: '1rem' }}>
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {mode === 'signup' && (
            <div className="field">
              <label htmlFor="auth_name">Full Name</label>
              <input
                id="auth_name"
                type="text"
                placeholder="e.g. Onyi Okolie"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="auth_email">Email</label>
            <input
              id="auth_email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="auth_password">Password</label>
            <input
              id="auth_password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--block"
            style={{ padding: '0.75rem', fontWeight: 700, marginTop: '0.25rem' }}
          >
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          {/* Social or divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'var(--color-text-muted, #666)', fontSize: '.75rem', margin: '0.25rem 0' }}>
            <span style={{ flex: 1, borderTop: '1px dashed var(--border-subtle, #ddd)' }} />
            <span>or continue with</span>
            <span style={{ flex: 1, borderTop: '1px dashed var(--border-subtle, #ddd)' }} />
          </div>

          <button
            type="button"
            className="btn btn--secondary btn--block"
            onClick={handleDemoSignIn}
            style={{ fontSize: '0.85rem', fontWeight: 600 }}
          >
            Instant Demo Sign-in (Onyi Okolie)
          </button>

          <p style={{ margin: '0.5rem 0 0', fontSize: '.85rem', textAlign: 'center' }}>
            {mode === 'signin' ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  onClick={() => setMode('signup')}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};
