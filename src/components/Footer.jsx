import React from 'react';
import { useGigNest } from '../context/GigNestContext';

export default function Footer() {
  const { navigate } = useGigNest();

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
              <span className="logo-mark"></span>
              Gig<b>Nest</b>
            </div>
            <p>Verified part-time gigs for students, posted by local businesses that have been checked by the college coordinator.</p>
          </div>

          <div>
            <h5>Students</h5>
            <button className="fl" onClick={() => navigate('explore')}>Explore gigs</button>
            <button className="fl" onClick={() => navigate('join')}>Create student account</button>
            <button className="fl" onClick={() => navigate('how-it-works')}>How it works</button>
          </div>

          <div>
            <h5>Employers</h5>
            <button className="fl" onClick={() => navigate('join')}>Register business</button>
            <button className="fl" onClick={() => navigate('signin')}>Sign in</button>
          </div>

          <div>
            <h5>Support</h5>
            <button className="fl" onClick={() => navigate('help')}>Help &amp; contact</button>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 GigNest · Minor Project</span>
          <span>Built with React + Vite · Deployed on Netlify</span>
        </div>
      </div>
    </footer>
  );
}

