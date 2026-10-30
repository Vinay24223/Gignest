import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';

export default function SignInView() {
  const { login, switchDemoRole, navigate } = useGigNest();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) login(email);
  };

  return (
    <div className="auth">
      <div className="auth-side">
        <div className="logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-mark"></span>
          Gig<b>Nest</b>
        </div>

        <div>
          <div className="pill verified" style={{ marginBottom: '14px', background: 'rgba(200,240,49,0.25)', color: '#C8F031' }}>
            Campus Work Portal
          </div>
          <h2>One portal. Three workspaces.</h2>
          <ul>
            <li>Students apply in seconds and follow live application stages.</li>
            <li>Local businesses hire checked campus talent quickly.</li>
            <li>Coordinator verifies businesses and protects student interests.</li>
          </ul>
        </div>

        <div style={{ fontSize: '13px', opacity: 0.8 }}>
          Minor Project · Built with React &amp; Netlify
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-box">
          <h1>Welcome back</h1>
          <p className="muted">Choose a 1-click demo role or sign in with your email.</p>

          {/* Quick 1-Click Demo Logins */}
          <div style={{ background: 'var(--violet-soft)', padding: '16px', borderRadius: '18px', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--violet)', marginBottom: '10px' }}>
              ⚡ 1-Click Instant Demo Login:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-ink btn-sm"
                style={{ justifyContent: 'flex-start', background: '#fff', color: 'var(--ink)' }}
                onClick={() => switchDemoRole('student')}
              >
                🎓 Log in as <strong>Student (Riya Sharma)</strong>
              </button>
              <button
                type="button"
                className="btn btn-ink btn-sm"
                style={{ justifyContent: 'flex-start', background: '#fff', color: 'var(--ink)' }}
                onClick={() => switchDemoRole('employer')}
              >
                🏪 Log in as <strong>Employer (Brew &amp; Bites)</strong>
              </button>
              <button
                type="button"
                className="btn btn-ink btn-sm"
                style={{ justifyContent: 'flex-start', background: '#fff', color: 'var(--ink)' }}
                onClick={() => switchDemoRole('admin')}
              >
                🛡️ Log in as <strong>Admin (Placement Coordinator)</strong>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', color: 'var(--muted)', fontSize: '13px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
            <span>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <label>Email address</label>
            <input
              type="email"
              required
              placeholder="e.g. riya@demo.test or your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="•••••••• (demo mode: any password)"
              defaultValue="demo123"
            />

            <button type="submit" className="btn btn-violet btn-block" style={{ marginTop: '8px' }}>
              Sign in to Dashboard →
            </button>
          </form>

          <p className="center muted" style={{ fontSize: '14px', marginTop: '24px' }}>
            Don't have an account?{' '}
            <strong style={{ color: 'var(--violet)', cursor: 'pointer' }} onClick={() => navigate('join')}>
              Join for free
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

