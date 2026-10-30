import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';
import GigCard from '../components/GigCard';
import { GIG_CATEGORIES, CAT_ICONS } from '../data/initialData';

export default function HomeView() {
  const {
    activeGigs,
    verifiedEmployersCount,
    studentsCount,
    hiredCount,
    navigate,
  } = useGigNest();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchArea, setSearchArea] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('explore');
  };

  // Count gigs per category
  const catCounts = {};
  GIG_CATEGORIES.forEach(c => {
    catCounts[c] = activeGigs.filter(g => g.category === c).length;
  });

  return (
    <div className="wrap">
      {/* Hero */}
      <section className="hero">
        <div>
          <div className="pill verified" style={{ marginBottom: '18px' }}>
            ✔ Every employer is verified by the coordinator
          </div>
          <h1>
            Part-time work that <em>fits your timetable.</em>
          </h1>
          <p className="lead">
            GigNest connects students with local businesses that need short-term help — billing, tutoring, events, data entry and more. Apply in a tap, track every step.
          </p>

          <form onSubmit={handleSearch} className="searchbar">
            <input
              type="text"
              placeholder="What work are you after?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="text"
              placeholder="Area (e.g. Model Town)"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
            />
            <button className="btn btn-violet" type="submit">
              Search
            </button>
          </form>

          <div className="quick-tags">
            <span>Popular:</span>
            <button onClick={() => navigate('explore')}>Accounts</button>
            <button onClick={() => navigate('explore')}>Tutoring</button>
            <button onClick={() => navigate('explore')}>Data entry</button>
            <button onClick={() => navigate('explore')}>Events</button>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="float-card fc1">
            <span className="pill verified">✔ Verified</span>
            <div className="t" style={{ marginTop: '8px' }}>Weekend billing assistant</div>
            <div className="s">Brew &amp; Bites Cafe · Model Town</div>
            <div className="p">₹600 / day</div>
          </div>
          <div className="float-card fc2">
            <div className="s">Application update</div>
            <div className="t">You're shortlisted! 🎉</div>
            <div className="s">Accountancy tutor · Class 11</div>
            <div className="p">Next: interview</div>
          </div>
          <div className="float-card fc3">
            <div className="t">📚 Accountancy tutor</div>
            <div className="s">Sarabha Nagar · weekdays</div>
            <div className="p">₹250 / hour</div>
          </div>
        </div>
      </section>

      {/* Live Stats Strip */}
      <section className="stats-strip">
        <div>
          <strong>{activeGigs.length}</strong>
          <span>open gigs</span>
        </div>
        <div>
          <strong>{verifiedEmployersCount}</strong>
          <span>verified employers</span>
        </div>
        <div>
          <strong>{studentsCount}</strong>
          <span>students joined</span>
        </div>
        <div>
          <strong>{hiredCount}</strong>
          <span>students hired</span>
        </div>
      </section>

      {/* Category Grid */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="kicker">Browse by type</div>
            <h2>What kind of work?</h2>
          </div>
          <button className="link-arrow" onClick={() => navigate('explore')}>
            See all gigs →
          </button>
        </div>

        <div className="cat-grid">
          {GIG_CATEGORIES.map(cat => {
            const cleanClass = `c-${cat.replace(/\s+/g, '')}`;
            return (
              <div
                key={cat}
                className={`cat-tile ${cleanClass}`}
                onClick={() => navigate('explore')}
              >
                <span className="ic">{CAT_ICONS[cat] || '💼'}</span>
                {cat}
                <small>{catCounts[cat] || 0} open</small>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fresh Gigs Carousel */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="section-head">
          <div>
            <div className="kicker">Just posted</div>
            <h2>Fresh verified gigs</h2>
          </div>
          <button className="link-arrow" onClick={() => navigate('explore')}>
            Explore more →
          </button>
        </div>

        <div className="rail">
          {activeGigs.map(gig => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      </section>

      {/* Two-Up CTA */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="duo">
          <div className="stu">
            <div className="kicker" style={{ color: 'var(--lime)' }}>For Students</div>
            <h3>Earn while you learn. Verified gigs only.</h3>
            <p>Every business is checked by the placement coordinator. No fake listings, no multi-level marketing, no unpaid trial shifts.</p>
            <button className="btn btn-lime" onClick={() => navigate('join')}>
              Sign up as Student
            </button>
          </div>
          <div className="emp">
            <div className="kicker" style={{ color: 'var(--violet)' }}>For Local Businesses</div>
            <h3>Hire dependable campus talent.</h3>
            <p>Get verified in 24 hours. Post part-time openings for events, accounts, and retail. Track applicants on a simple Kanban board.</p>
            <button className="btn btn-ink" onClick={() => navigate('join')}>
              Register your business
            </button>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="section-head">
          <div>
            <div className="kicker">The Process</div>
            <h2>How GigNest works for students</h2>
          </div>
        </div>

        <div className="steps3">
          <div>
            <h3>1. Verified &amp; Local</h3>
            <p>Only verified employers near campus can post. Details, schedules, and pay rates are transparent upfront.</p>
          </div>
          <div>
            <h3>2. 1-Tap Application</h3>
            <p>No lengthy resumes needed. Introduce yourself, highlight your skills (Excel, Tally, languages), and submit in seconds.</p>
          </div>
          <div>
            <h3>3. Live Status Board</h3>
            <p>Track your applications from Applied to Shortlisted and Hired on your visual tracker. Direct contact unlocked once hired.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

