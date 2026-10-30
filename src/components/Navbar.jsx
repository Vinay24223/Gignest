import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';

export default function Navbar() {
  const { currentUser, currentView, navigate } = useGigNest();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardView = () => {
    if (!currentUser) return 'signin';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    if (currentUser.role === 'employer') return 'employer-dashboard';
    return 'student-dashboard';
  };

  const handleNav = (view) => {
    navigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="topnav">
      <div className="topnav-in">
        <div className="logo" onClick={() => handleNav('home')}>
          <span className="logo-mark"></span>
          Gig<b>Nest</b>
        </div>

        <button
          className="nav-burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={`topnav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button
            className={currentView === 'explore' ? 'on' : ''}
            onClick={() => handleNav('explore')}
          >
            Explore gigs
          </button>
          <button
            className={currentView === 'how-it-works' ? 'on' : ''}
            onClick={() => handleNav('how-it-works')}
          >
            How it works
          </button>
          <button
            className={currentView === 'join' ? 'on' : ''}
            onClick={() => handleNav('join')}
          >
            Hire students
          </button>
          <button
            className={currentView === 'help' ? 'on' : ''}
            onClick={() => handleNav('help')}
          >
            Help
          </button>
        </nav>

        <div className="topnav-right">
          {currentUser ? (
            <>
              <button
                className="btn btn-ink btn-sm"
                onClick={() => handleNav(getDashboardView())}
              >
                Dashboard
              </button>
              <span
                className="avatar"
                title={`${currentUser.full_name} (${currentUser.role})`}
                onClick={() => handleNav(getDashboardView())}
              >
                {currentUser.full_name.charAt(0).toUpperCase()}
              </span>
            </>
          ) : (
            <>
              <button className="signin-btn" onClick={() => handleNav('signin')}>
                Sign in
              </button>
              <button className="btn btn-violet btn-sm" onClick={() => handleNav('join')}>
                Join free
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

