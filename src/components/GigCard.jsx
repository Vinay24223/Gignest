import React from 'react';
import { useGigNest } from '../context/GigNestContext';
import { PAY_TYPES, CAT_ICONS } from '../data/initialData';

export default function GigCard({ gig }) {
  const { getEmployerForGig, savedGigIds, toggleSave, navigate } = useGigNest();
  const employer = getEmployerForGig(gig);
  const isSaved = savedGigIds.includes(gig.id);

  const cleanCatClass = `c-${gig.category.replace(/\s+/g, '')}`;
  const payLabel = `₹${gig.pay_amount.toLocaleString('en-IN')} ${PAY_TYPES[gig.pay_type] || gig.pay_type}`;

  return (
    <div className="gcard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`cat-chip ${cleanCatClass}`}>
          {CAT_ICONS[gig.category] || '💼'} {gig.category}
        </span>
        <button
          className="save-btn"
          onClick={() => toggleSave(gig.id)}
          title={isSaved ? 'Remove from saved' : 'Save gig'}
          aria-label="Save gig"
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>

      <h3>{gig.title}</h3>

      <div className="meta">
        <strong>{employer?.business_name || 'Verified Employer'}</strong> · 📍 {gig.area}
      </div>

      <div className="pay">{payLabel}</div>

      <div className="muted" style={{ fontSize: '13px', marginTop: '4px' }}>
        ⏱️ {gig.schedule} · 👥 {gig.openings} opening{gig.openings > 1 ? 's' : ''}
      </div>

      <div className="foot">
        <button
          className="btn btn-ink btn-sm btn-block"
          onClick={() => navigate('view', gig.id)}
        >
          View gig &amp; apply
        </button>
      </div>
    </div>
  );
}

