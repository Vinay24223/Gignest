import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';
import { PAY_TYPES, CAT_ICONS } from '../data/initialData';
import ApplyModal from '../components/ApplyModal';

export default function GigDetailView() {
  const {
    activeGigId,
    gigs,
    getEmployerForGig,
    currentUser,
    applications,
    savedGigIds,
    toggleSave,
    navigate,
  } = useGigNest();

  const [showApplyModal, setShowApplyModal] = useState(false);

  const gig = gigs.find(g => g.id === activeGigId) || gigs[0];
  if (!gig) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Gig not found</h2>
        <button className="btn btn-violet" onClick={() => navigate('explore')}>
          Back to Explore
        </button>
      </div>
    );
  }

  const employer = getEmployerForGig(gig);
  const isSaved = savedGigIds.includes(gig.id);
  const payLabel = `₹${gig.pay_amount.toLocaleString('en-IN')} ${PAY_TYPES[gig.pay_type] || gig.pay_type}`;
  const cleanCatClass = `c-${gig.category.replace(/\s+/g, '')}`;

  // Check if student applied
  const existingApp = currentUser?.role === 'student'
    ? applications.find(a => a.gig_id === gig.id && a.student_id === currentUser.id)
    : null;

  return (
    <div className="wrap">
      <div className="view-head">
        <div className="crumbs">
          <button onClick={() => navigate('explore')}>← Back to all gigs</button>
          <span> / {gig.category} / {gig.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className={`cat-chip ${cleanCatClass}`}>
            {CAT_ICONS[gig.category] || '💼'} {gig.category}
          </span>
          <span className="pill verified">✔ Verified Employer</span>
        </div>
        <h1>{gig.title}</h1>
      </div>

      <div className="view-grid">
        {/* Left Column: Details */}
        <div>
          <div className="panel">
            <h3>Role &amp; Schedule Details</h3>
            <div className="facts">
              <div className="fact">
                <small>Pay rate</small>
                <b>{payLabel}</b>
              </div>
              <div className="fact">
                <small>Timing / Schedule</small>
                <b>{gig.schedule}</b>
              </div>
              <div className="fact">
                <small>Location</small>
                <b>📍 {gig.area}</b>
              </div>
              <div className="fact">
                <small>Spots Available</small>
                <b>👥 {gig.openings} opening{gig.openings > 1 ? 's' : ''}</b>
              </div>
            </div>

            <h3>About this gig</h3>
            <div className="body" style={{ lineHeight: '1.7', fontSize: '15px' }}>
              {gig.description}
            </div>
          </div>

          {/* Employer Profile */}
          <div className="panel">
            <h3>About the Employer</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'var(--violet-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                🏪
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '18px' }}>{employer?.business_name || 'Local Business'}</h4>
                <div className="muted" style={{ fontSize: '13px' }}>
                  {employer?.business_type || 'Local Shop'} · Verified by Campus Placement Cell
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#555' }}>
              {employer?.about || 'A local verified business offering student-friendly part-time roles.'}
            </p>

            <div style={{ fontSize: '13px', color: 'var(--muted)', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
              📍 <strong>Location:</strong> {employer?.address || gig.area}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Apply Card */}
        <div>
          <div className="panel apply-box">
            <div className="muted" style={{ fontSize: '13px' }}>Offered compensation</div>
            <div className="big">{payLabel}</div>

            <div style={{ margin: '18px 0', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span className="muted">Application status:</span>
                <span style={{ fontWeight: 700 }}>
                  {gig.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span className="muted">Open spots:</span>
                <span style={{ fontWeight: 700 }}>{gig.openings}</span>
              </div>
            </div>

            {existingApp ? (
              <div style={{ textAlign: 'center' }}>
                <div className={`st st-${existingApp.status}`} style={{ fontSize: '14px', padding: '8px 16px', display: 'block', marginBottom: '12px' }}>
                  Status: {existingApp.status.toUpperCase()}
                </div>
                <p className="muted" style={{ fontSize: '13px' }}>
                  You applied for this gig on {existingApp.applied_at.substring(0, 10)}.
                </p>
                <button
                  className="btn btn-ink btn-block"
                  onClick={() => navigate('student-dashboard')}
                >
                  Track on my board →
                </button>
              </div>
            ) : currentUser?.role === 'employer' ? (
              <div>
                <div className="note note-warn" style={{ fontSize: '13px' }}>
                  You are signed in as an Employer. To test applying, switch to a Student profile.
                </div>
                <button
                  className="btn btn-lime btn-block"
                  onClick={() => navigate('employer-dashboard')}
                >
                  Open Employer Dashboard
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-violet btn-block"
                  onClick={() => {
                    if (!currentUser) {
                      navigate('signin');
                    } else {
                      setShowApplyModal(true);
                    }
                  }}
                  style={{ marginBottom: '12px' }}
                >
                  Apply now 🚀
                </button>

                <button
                  className="btn btn-ghost btn-block"
                  onClick={() => toggleSave(gig.id)}
                >
                  {isSaved ? '❤️ Saved in Shortlist' : '🤍 Save for later'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal gig={gig} onClose={() => setShowApplyModal(false)} />
      )}
    </div>
  );
}

