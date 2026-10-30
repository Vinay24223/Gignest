import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGigNest } from '../context/GigNestContext';

export default function ApplyModal({ gig, onClose }) {
  const { currentUser, applyForGig, navigate } = useGigNest();
  const [pitch, setPitch] = useState('I am interested in this role and my timetable aligns with the schedule.');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pitch.trim()) return;

    const ok = applyForGig(gig.id, pitch);
    if (ok) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      onClose();
      navigate('student-dashboard');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '22px' }}>Apply for Gig</h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 0, fontSize: '22px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <p className="muted" style={{ fontSize: '14px', marginBottom: '18px' }}>
          You are applying for <strong>{gig.title}</strong> in {gig.area}.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Your Name &amp; Course</label>
          <input
            type="text"
            readOnly
            value={`${currentUser?.full_name || ''} (${currentUser?.course || 'Student'}, Year ${currentUser?.study_year || '1'})`}
            style={{ background: 'var(--bg)' }}
          />

          <label>Short Note to Employer</label>
          <textarea
            required
            rows={4}
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Introduce yourself, your relevant skills, and when you can start..."
          />
          <div className="hint">Mention any skills matching the job description (e.g. Excel, Tally, Communication).</div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-violet" style={{ flex: 2 }}>
              Submit Application 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

