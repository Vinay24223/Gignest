import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';
import { GIG_CATEGORIES } from '../data/initialData';

export default function AdminDashboardView() {
  const {
    employers,
    gigs,
    applications,
    users,
    verifyEmployer,
    updateGigStatus,
    logout,
    navigate,
    showToast,
  } = useGigNest();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'employers' | 'gigs' | 'students' | 'reports'

  const pendingEmployers = employers.filter(e => e.status === 'pending');
  const studentUsers = users.filter(u => u.role === 'student');

  // CSV Report Generator
  const handleDownloadCSV = () => {
    let csv = 'Gig Title,Employer,Category,Area,Pay Amount,Pay Type,Status,Openings\n';
    gigs.forEach(g => {
      const emp = employers.find(e => e.id === g.employer_id);
      csv += `"${g.title}","${emp?.business_name || ''}","${g.category}","${g.area}",${g.pay_amount},"${g.pay_type}","${g.status}",${g.openings}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gignest_reports_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV downloaded successfully!', 'ok');
  };

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="side">
        <div className="logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-mark"></span>
          Gig<b>Nest</b>
        </div>

        <nav>
          <button className={activeTab === 'queue' ? 'on' : ''} onClick={() => setActiveTab('queue')}>
            ⏳ <span className="t">Verification Queue</span>
            {pendingEmployers.length > 0 && <span className="count">{pendingEmployers.length}</span>}
          </button>
          <button className={activeTab === 'employers' ? 'on' : ''} onClick={() => setActiveTab('employers')}>
            🏪 <span className="t">Employers</span>
          </button>
          <button className={activeTab === 'gigs' ? 'on' : ''} onClick={() => setActiveTab('gigs')}>
            💼 <span className="t">Gigs Moderation</span>
          </button>
          <button className={activeTab === 'students' ? 'on' : ''} onClick={() => setActiveTab('students')}>
            🎓 <span className="t">Students</span>
          </button>
          <button className={activeTab === 'reports' ? 'on' : ''} onClick={() => setActiveTab('reports')}>
            📊 <span className="t">Reports &amp; CSV</span>
          </button>
        </nav>

        <div className="sep" />

        <div className="me">
          <span className="avatar" style={{ background: 'var(--lime)', color: 'var(--ink)' }}>A</span>
          <div>
            <b>Placement Cell</b>
            <small>Admin / Coordinator</small>
          </div>
          <button onClick={logout} title="Sign Out">🚪</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Verification Queue */}
        {activeTab === 'queue' && (
          <div>
            <div className="main-head">
              <div>
                <h1>Employer Verification Queue</h1>
                <p className="muted">Approve businesses before they can post gigs to students.</p>
              </div>
            </div>

            {pendingEmployers.length === 0 ? (
              <div className="box center" style={{ padding: '50px 20px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>✅</div>
                <h3>Queue is all clear</h3>
                <p className="muted">All registered businesses have been reviewed and verified.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {pendingEmployers.map(emp => {
                  const owner = users.find(u => u.id === emp.user_id);
                  return (
                    <div key={emp.id} className="box" style={{ borderLeft: '6px solid var(--amber-d)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ margin: 0 }}>{emp.business_name}</h3>
                            <span className="st st-pending">Pending Review</span>
                          </div>
                          <div className="muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                            <strong>Type:</strong> {emp.business_type} · 📍 <strong>Area:</strong> {emp.area} ({emp.address})
                          </div>
                          <div className="muted" style={{ fontSize: '13px' }}>
                            👤 <strong>Contact Person:</strong> {owner?.full_name} · 📞 {owner?.phone} · ✉️ {owner?.email}
                          </div>
                          <p style={{ fontSize: '14px', marginTop: '10px', background: 'var(--bg)', padding: '10px 14px', borderRadius: '12px' }}>
                            "{emp.about || 'Local campus establishment.'}"
                          </p>
                        </div>

                        <div className="acts">
                          <button
                            className="btn btn-lime btn-sm"
                            onClick={() => verifyEmployer(emp.id, 'verified', 'Verified by Placement Coordinator.')}
                          >
                            Approve &amp; Verify ✔️
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => verifyEmployer(emp.id, 'rejected', 'Verification documents insufficient.')}
                          >
                            Reject ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Employers List */}
        {activeTab === 'employers' && (
          <div>
            <div className="main-head">
              <div>
                <h1>Registered Employers Directory</h1>
                <p className="muted">All registered local shops, coaching centres, and businesses.</p>
              </div>
            </div>

            <div className="box">
              <div className="tbl">
                <table>
                  <thead>
                    <tr>
                      <th>Business</th>
                      <th>Type</th>
                      <th>Area</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employers.map(emp => (
                      <tr key={emp.id}>
                        <td><strong>{emp.business_name}</strong></td>
                        <td>{emp.business_type}</td>
                        <td>{emp.area}</td>
                        <td><span className={`st st-${emp.status}`}>{emp.status}</span></td>
                        <td>
                          {emp.status === 'verified' ? (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => verifyEmployer(emp.id, 'pending')}
                            >
                              Revoke Verification
                            </button>
                          ) : (
                            <button
                              className="btn btn-lime btn-sm"
                              onClick={() => verifyEmployer(emp.id, 'verified')}
                            >
                              Verify Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Gigs Moderation */}
        {activeTab === 'gigs' && (
          <div>
            <div className="main-head">
              <div>
                <h1>Gigs Moderation</h1>
                <p className="muted">Review and moderate active gig postings across the portal.</p>
              </div>
            </div>

            <div className="box">
              <div className="tbl">
                <table>
                  <thead>
                    <tr>
                      <th>Gig Title</th>
                      <th>Category</th>
                      <th>Area</th>
                      <th>Pay</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gigs.map(g => (
                      <tr key={g.id}>
                        <td><strong>{g.title}</strong></td>
                        <td>{g.category}</td>
                        <td>{g.area}</td>
                        <td>₹{g.pay_amount} / {g.pay_type}</td>
                        <td><span className={`st st-${g.status}`}>{g.status}</span></td>
                        <td>
                          {g.status === 'open' ? (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => updateGigStatus(g.id, 'removed')}
                            >
                              Take Down ✕
                            </button>
                          ) : (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => updateGigStatus(g.id, 'open')}
                            >
                              Re-open
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Students List */}
        {activeTab === 'students' && (
          <div>
            <div className="main-head">
              <div>
                <h1>Enrolled Student Seekers</h1>
                <p className="muted">Students looking for part-time gigs.</p>
              </div>
            </div>

            <div className="box">
              <div className="tbl">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Degree &amp; Year</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Declared Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentUsers.map(s => (
                      <tr key={s.id}>
                        <td><strong>{s.full_name}</strong></td>
                        <td>{s.course} (Year {s.study_year})</td>
                        <td>{s.phone}</td>
                        <td>{s.email}</td>
                        <td><span className="pill" style={{ background: 'var(--violet-soft)' }}>{s.skills || 'Commerce fundamentals'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="main-head">
              <div>
                <h1>Placement Reports &amp; Analytics</h1>
                <p className="muted">Export portal engagement and application logs.</p>
              </div>
              <button className="btn btn-violet btn-sm" onClick={handleDownloadCSV}>
                📥 Download CSV Report
              </button>
            </div>

            <div className="cards4">
              <div className="kpi k1">
                <b>{gigs.length}</b>
                <span>Total Gigs</span>
              </div>
              <div className="kpi k2">
                <b>{applications.length}</b>
                <span>Applications</span>
              </div>
              <div className="kpi k5">
                <b>{applications.filter(a => a.status === 'hired').length}</b>
                <span>Students Placed</span>
              </div>
              <div className="kpi k4">
                <b>{employers.filter(e => e.status === 'verified').length}</b>
                <span>Verified Partners</span>
              </div>
            </div>

            <div className="box">
              <h3>Gigs Distribution by Category</h3>
              <div style={{ marginTop: '16px' }}>
                {GIG_CATEGORIES.map(cat => {
                  const count = gigs.filter(g => g.category === cat).length;
                  const pct = gigs.length ? Math.round((count / gigs.length) * 100) : 0;
                  return (
                    <div key={cat} className="bar-row">
                      <div className="nm">{cat}</div>
                      <div className="bar">
                        <i style={{ width: `${Math.max(pct, 4)}%` }} />
                      </div>
                      <div className="n">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

