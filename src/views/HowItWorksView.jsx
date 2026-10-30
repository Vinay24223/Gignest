import React from 'react';
import { useGigNest } from '../context/GigNestContext';

export default function HowItWorksView() {
  const { navigate } = useGigNest();

  return (
    <div className="wrap" style={{ padding: '40px 24px 80px' }}>
      <div className="section-head">
        <div>
          <div className="kicker">Campus Ecosystem</div>
          <h1>How GigNest Works</h1>
          <p className="muted" style={{ maxWidth: '600px', fontSize: '16px' }}>
            GigNest was created as a collegiate initiative to bridge commerce students seeking ethical part-time income with verified neighborhood employers.
          </p>
        </div>
      </div>

      <div className="duo" style={{ marginBottom: '40px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '24px', padding: '32px' }}>
          <h2 style={{ fontSize: '24px', color: 'var(--violet)' }}>For Students</h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Verified-Only Listings:</strong> No unvetted third parties or scam ads. Every employer is verified.</li>
            <li><strong>Fair Hourly &amp; Daily Wages:</strong> Pay rates and time commitments are clearly transparent.</li>
            <li><strong>Visual Kanban Tracker:</strong> See real-time status updates: Applied ➔ Shortlisted ➔ Hired.</li>
            <li><strong>Direct Contact Access:</strong> Instant WhatsApp and phone unlock once you are marked as Hired.</li>
          </ul>
          <button className="btn btn-violet btn-sm" onClick={() => navigate('join')}>
            Register as Student
          </button>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '24px', padding: '32px' }}>
          <h2 style={{ fontSize: '24px', color: 'var(--ink)' }}>For Local Businesses</h2>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Fast Campus Outreach:</strong> Reach hundreds of motivated college students in your immediate area.</li>
            <li><strong>Shortlisting Tools:</strong> Filter applications based on degree, academic year, and practical skills.</li>
            <li><strong>Controlled Openings:</strong> Automatically stop intake once all spots are hired.</li>
            <li><strong>Zero Platform Fees:</strong> Free to post and coordinate with students directly.</li>
          </ul>
          <button className="btn btn-lime btn-sm" onClick={() => navigate('join')}>
            Register Business
          </button>
        </div>
      </div>

      <div className="panel" style={{ background: 'var(--violet-soft)', border: 'none', padding: '32px' }}>
        <h3 style={{ color: 'var(--violet)', fontSize: '20px' }}>🛡️ The Verification Guarantee</h3>
        <p style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
          Before any employer is allowed to post gigs, the college placement coordinator verifies physical shop/office details and contact validity. Employers in <em>pending</em> status cannot have their gigs seen by students until granted approval.
        </p>
      </div>
    </div>
  );
}

