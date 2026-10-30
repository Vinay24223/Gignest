import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';
import { PAY_TYPES } from '../data/initialData';

export default function StudentDashboardView() {
  const {
    currentUser,
    applications,
    gigs,
    getEmployerForGig,
    savedGigIds,
    toggleSave,
    logout,
    navigate,
    showToast,
  } = useGigNest();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'applications' | 'saved' | 'settings'

  // Form states for settings
  const [skills, setSkills] = useState(currentUser?.skills || 'Tally, MS Excel, Billing');
  const [phone, setPhone] = useState(currentUser?.phone || '9844444444');

  // Filter student's applications
  const myApps = applications.filter(a => a.student_id === currentUser?.id);
  const mySaved = gigs.filter(g => savedGigIds.includes(g.id));

  const countApplied = myApps.filter(a => a.status === 'applied').length;
  const countShortlisted = myApps.filter(a => a.status === 'shortlisted').length;
  const countHired = myApps.filter(a => a.status === 'hired').length;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    currentUser.skills = skills;
    currentUser.phone = phone;
    showToast('Profile updated successfully!', 'ok');
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
          <button className={activeTab === 'overview' ? 'on' : ''} onClick={() => setActiveTab('overview')}>
            🏠 <span className="t">Overview</span>
          </button>
          <button className={activeTab === 'applications' ? 'on' : ''} onClick={() => setActiveTab('applications')}>
            📌 <span className="t">Applications</span>
            {myApps.length > 0 && <span className="count">{myApps.length}</span>}
          </button>
          <button className={activeTab === 'saved' ? 'on' : ''} onClick={() => setActiveTab('saved')}>
            ❤️ <span className="t">Saved Gigs</span>
            {mySaved.length > 0 && <span className="count">{mySaved.length}</span>}
          </button>
          <button className={activeTab === 'settings' ? 'on' : ''} onClick={() => setActiveTab('settings')}>
            ⚙️ <span className="t">Settings</span>
          </button>
        </nav>

        <div className="sep" />

        <div className="me">
          <span className="avatar">{currentUser?.full_name?.charAt(0) || 'S'}</span>
          <div>
            <b>{currentUser?.full_name}</b>
            <small>Student · {currentUser?.course || 'Commerce'}</small>
          </div>
          <button onClick={logout} title="Sign Out">🚪</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        {activeTab === 'overview' && (
          <div>
            <div className="main-head">
              <div>
                <h1>Welcome, {currentUser?.full_name}! 👋</h1>
                <p className="muted">Track your active applications, saved gigs, and hiring updates.</p>
              </div>
              <button className="btn btn-violet btn-sm" onClick={() => navigate('explore')}>
                + Explore New Gigs
              </button>
            </div>

            <div className="cards4">
              <div className="kpi k1">
                <b>{myApps.length}</b>
                <span>Total Applied</span>
              </div>
              <div className="kpi k3">
                <b>{countShortlisted}</b>
                <span>Shortlisted</span>
              </div>
              <div className="kpi k2">
                <b>{countHired}</b>
                <span>Hired &amp; Active</span>
              </div>
              <div className="kpi k4">
                <b>{mySaved.length}</b>
                <span>Saved Gigs</span>
              </div>
            </div>

            <div className="box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Recent Application Activity</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('applications')}>
                  View Kanban Board →
                </button>
              </div>

              {myApps.length === 0 ? (
                <div className="empty">
                  <p>You haven't applied to any gigs yet.</p>
                  <button className="btn btn-violet btn-sm" onClick={() => navigate('explore')}>
                    Browse open gigs
                  </button>
                </div>
              ) : (
                <div className="tbl">
                  <table>
                    <thead>
                      <tr>
                        <th>Gig Title</th>
                        <th>Employer</th>
                        <th>Pay</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myApps.map(app => {
                        const gig = gigs.find(g => g.id === app.gig_id);
                        const emp = getEmployerForGig(gig);
                        return (
                          <tr key={app.id}>
                            <td><strong>{gig?.title || 'Gig'}</strong></td>
                            <td>{emp?.business_name || 'Business'}</td>
                            <td>₹{gig?.pay_amount} {PAY_TYPES[gig?.pay_type]}</td>
                            <td>
                              <span className={`st st-${app.status}`}>{app.status}</span>
                            </td>
                            <td>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => navigate('view', gig?.id)}
                              >
                                View Gig
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Applications Kanban Board */}
        {activeTab === 'applications' && (
          <div>
            <div className="main-head">
              <div>
                <h1>My Applications Board</h1>
                <p className="muted">Track each step of your job search in real-time.</p>
              </div>
            </div>

            <div className="board">
              {['applied', 'shortlisted', 'hired', 'rejected'].map(colStatus => {
                const colApps = myApps.filter(a => a.status === colStatus);
                const colLabels = {
                  applied: 'Applied',
                  shortlisted: 'Shortlisted 🎉',
                  hired: 'Hired & Ready 🚀',
                  rejected: 'Closed / Not Selected',
                };

                return (
                  <div key={colStatus} className="lane">
                    <h4>
                      {colLabels[colStatus]}
                      <span>{colApps.length}</span>
                    </h4>

                    {colApps.length === 0 ? (
                      <div className="lane-empty">No applications</div>
                    ) : (
                      colApps.map(app => {
                        const gig = gigs.find(g => g.id === app.gig_id);
                        const emp = getEmployerForGig(gig);

                        return (
                          <div key={app.id} className="kcard">
                            <h5>{gig?.title}</h5>
                            <div className="muted">{emp?.business_name} · 📍 {gig?.area}</div>
                            <div style={{ fontWeight: 700, color: 'var(--violet)', margin: '6px 0' }}>
                              ₹{gig?.pay_amount} {PAY_TYPES[gig?.pay_type]}
                            </div>

                            {app.status === 'hired' && (
                              <div className="hired-banner">
                                📞 Employer Contact Unlocked:<br />
                                <strong>Phone:</strong> {emp?.phone || '9811111111'}<br />
                                <strong>Address:</strong> {emp?.address || gig?.area}
                              </div>
                            )}

                            <details>
                              <summary>View Activity Log</summary>
                              <ul className="tl">
                                {app.log?.map((entry, idx) => (
                                  <li key={idx}>
                                    <b>{entry.status}</b>: {entry.note}
                                    <small>{entry.time?.substring(0, 16)}</small>
                                  </li>
                                ))}
                              </ul>
                            </details>

                            <div className="acts">
                              <button
                                className="btn btn-ghost btn-sm btn-block"
                                onClick={() => navigate('view', gig?.id)}
                              >
                                View Gig Details
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Saved Gigs */}
        {activeTab === 'saved' && (
          <div>
            <div className="main-head">
              <div>
                <h1>Saved Gigs</h1>
                <p className="muted">Your bookmarked gigs ready for when you want to apply.</p>
              </div>
            </div>

            {mySaved.length === 0 ? (
              <div className="empty">
                <h3>No saved gigs</h3>
                <p className="muted">Click the heart ❤️ icon on any gig card to save it here.</p>
                <button className="btn btn-violet btn-sm" onClick={() => navigate('explore')}>
                  Explore gigs
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {mySaved.map(gig => {
                  const emp = getEmployerForGig(gig);
                  return (
                    <div key={gig.id} className="box" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="pill verified">✔ {gig.category}</span>
                        <button className="save-btn" onClick={() => toggleSave(gig.id)}>
                          ❤️
                        </button>
                      </div>
                      <h3 style={{ margin: '6px 0' }}>{gig.title}</h3>
                      <div className="muted" style={{ fontSize: '13px' }}>
                        {emp?.business_name} · 📍 {gig.area}
                      </div>
                      <div style={{ font: "800 20px 'Sora'", color: 'var(--violet)' }}>
                        ₹{gig.pay_amount} {PAY_TYPES[gig.pay_type]}
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                        <button
                          className="btn btn-ink btn-sm btn-block"
                          onClick={() => navigate('view', gig.id)}
                        >
                          View &amp; Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '600px' }}>
            <div className="main-head">
              <div>
                <h1>Profile Settings</h1>
                <p className="muted">Keep your academic and contact details up to date.</p>
              </div>
            </div>

            <div className="box">
              <form onSubmit={handleSaveSettings}>
                <label>Full Name</label>
                <input type="text" readOnly value={currentUser?.full_name || ''} style={{ background: 'var(--bg)' }} />

                <label>Email Address</label>
                <input type="email" readOnly value={currentUser?.email || ''} style={{ background: 'var(--bg)' }} />

                <div className="grid2">
                  <div>
                    <label>Degree / Course</label>
                    <input type="text" readOnly value={currentUser?.course || 'BCom'} style={{ background: 'var(--bg)' }} />
                  </div>
                  <div>
                    <label>Study Year</label>
                    <input type="text" readOnly value={`Year ${currentUser?.study_year || 2}`} style={{ background: 'var(--bg)' }} />
                  </div>
                </div>

                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <label>Skills &amp; Capabilities</label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Tally, Excel, Typing, Inventory"
                />

                <button type="submit" className="btn btn-violet" style={{ marginTop: '12px' }}>
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

