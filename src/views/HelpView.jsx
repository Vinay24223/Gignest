import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';

const FAQS = [
  {
    q: 'Who can apply for gigs on GigNest?',
    a: 'Any enrolled college student looking for ethical part-time gigs that fit their class timetable and exam schedule.',
  },
  {
    q: 'How does an employer get verified?',
    a: 'Once an employer signs up, the college placement coordinator reviews their establishment details. Once approved, their posted gigs go live to all students.',
  },
  {
    q: 'Can a student apply for multiple gigs at once?',
    a: 'Yes, students can apply to multiple gigs, but the platform limits you to one application per specific gig to avoid spamming.',
  },
  {
    q: 'Is there any fee to join or apply?',
    a: 'No. GigNest is 100% free for both college students and local businesses.',
  },
];

export default function HelpView() {
  const { showToast } = useGigNest();
  const [openIdx, setOpenIdx] = useState(0);
  const [message, setMessage] = useState('');

  const handleContact = (e) => {
    e.preventDefault();
    showToast('Your message has been sent to the placement coordinator.', 'ok');
    setMessage('');
  };

  return (
    <div className="wrap" style={{ padding: '40px 24px 80px' }}>
      <div className="section-head">
        <div>
          <div className="kicker">Support &amp; FAQ</div>
          <h1>Frequently Asked Questions</h1>
          <p className="muted" style={{ fontSize: '16px' }}>
            Everything you need to know about navigating gigs, applications, and verification.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: '32px' }}>
        <div>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '14px',
                cursor: 'pointer',
              }}
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '16px' }}>{faq.q}</h4>
                <span style={{ fontSize: '18px', color: 'var(--violet)' }}>
                  {openIdx === i ? '▲' : '▼'}
                </span>
              </div>
              {openIdx === i && (
                <p style={{ marginTop: '12px', marginBottom: 0, color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="panel" style={{ border: '2px solid var(--violet-soft)' }}>
            <h3>Contact Placement Cell</h3>
            <p className="muted" style={{ fontSize: '14px' }}>
              Have questions or feedback? Send a direct note to the administrative coordinator.
            </p>

            <form onSubmit={handleContact}>
              <label>Your Note</label>
              <textarea
                required
                rows={4}
                placeholder="Write your query or question here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="btn btn-violet btn-block">
                Send Message ✉️
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

