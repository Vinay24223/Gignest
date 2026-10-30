import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGigNest } from '../context/GigNestContext';
import { GIG_CATEGORIES, PAY_TYPES } from '../data/initialData';

export default function EmployerDashboardView() {
  const {
    currentUser,
    employers,
    gigs,
    applications,
    users,
    postGig,
    updateApplicationStatus,
    logout,
    navigate,
    showToast,
  } = useGigNest();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'post' | 'applicants' | 'settings'

  // Identify employer profile
  const employer = employers.find(e => e.user_id === currentUser?.id) || employers[0];

  // Employer's gigs
  const myGigs = gigs.filter(g => g.employer_id === employer?.id);
  const myGigIds = myGigs.map(g => g.id);
  const myApplicants = applications.filter(a => myGigIds.includes(a.gig_id));

  // Post gig form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Accounts');
  const [area, setArea] = useState(employer?.area || 'Model Town');
  const [payAmount, setPayAmount] = useState('600');
  const [payType, setPayType] = useState('day');
  const [schedule, setSchedule] = useState('Sat-Sun, 5 pm - 10 pm');
  const [openings, setOpenings] = useState('2');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [description, setDescription] = useState('');

  // Selected gig for filtering applicants
  const [selectedGigId, setSelectedGigId] = useState('all');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (employer?.status !== 'verified') {
      showToast('Cannot post: Business is pending verification by admin.', 'err');
      return;
    }

    const ok = postGig({
      title,
      category,
      area,
      pay_amount: payAmount,
      pay_type: payType,
      schedule,
      openings,
      end_date: endDate,
      description,
    });

    if (ok) {
      setTitle('');
      setDescription('');
      setActiveTab('overview');
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    if (newStatus === 'hired') {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    }
    updateApplicationStatus(appId, newStatus);
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
          <button className={activeTab === 'post' ? 'on' : ''} onClick={() => setActiveTab('post')}>
            ➕ <span className="t">Post a Gig</span>
          </button>
          <button className={activeTab === 'applicants' ? 'on' : ''} onClick={() => setActiveTab('applicants')}>
            👥 <span className="t">Applicants</span>
            {myApplicants.length > 0 && <span className="count">{myApplicants.length}</span>}
          </button>
          <button className={activeTab === 'settings' ? 'on' : ''} onClick={() => setActiveTab('settings')}>
            ⚙️ <span className="t">Settings</span>
          </button>
        </nav>

        <div className="sep" />

        <div className="me">
          <span className="avatar" style={{ background: 'var(--violet)', color: '#fff' }}>
            {employer?.business_name?.charAt(0) || 'E'}
          </span>
          <div>
            <b>{employer?.business_name}</b>
            <small>Employer · {employer?.status}</small>
          </div>
          <button onClick={logout} title="Sign Out">🚪</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        {employer?.status === 'pending' && (
          <div className="note note-warn" style={{ marginBottom: '24px' }}>
            ⏳ <strong>Verification Pending:</strong> Your business registration is under review by the college coordinator. You cannot post gigs until approved.
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              💡 <em>Tip for Viva/Testing: Click "🛡️ Admin" on the top black demo bar to switch to the admin view and approve this business with 1 click!</em>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="main-head">
              <div>
                <h1>{employer?.business_name}</h1>
                <p className="muted">Manage your posted gigs and review student applicants.</p>
              </div>
              {employer?.status === 'verified' && (
                <button className="btn btn-violet btn-sm" onClick={() => setActiveTab('post')}>
                  + Post a New Gig
                </button>
              )}
            </div>

            <div className="cards4">
              <div className="kpi k1">
                <b>{myGigs.length}</b>
                <span>Posted Gigs</span>
              </div>
              <div className="kpi k3">
                <b>{myApplicants.length}</b>
                <span>Total Applicants</span>
              </div>
              <div className="kpi k2">
                <b>{myApplicants.filter(a => a.status === 'hired').length}</b>
                <span>Hired Students</span>
              </div>
              <div className="kpi k5">
                <b style={{ fontSize: '24px', textTransform: 'capitalize' }}>{employer?.status}</b>
                <span>Account Status</span>
              </div>
            </div>

            <div className="box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Your Gigs</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('applicants')}>
                  Manage Applicants →
                </button>
              </div>

              {myGigs.length === 0 ? (
                <div className="empty">
                  <h3>No gigs posted yet</h3>
                  <p className="muted">Post your first part-time student gig to get applications.</p>
                  <button className="btn btn-violet btn-sm" onClick={() => setActiveTab('post')}>
                    Post a gig
                  </button>
                </div>
              ) : (
                <div className="tbl">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Pay Rate</th>
                        <th>Openings</th>
                        <th>Applicants</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myGigs.map(g => {
                        const appCount = applications.filter(a => a.gig_id === g.id).length;
                        return (
                          <tr key={g.id}>
                            <td><strong>{g.title}</strong></td>
                            <td>{g.category}</td>
                            <td>₹{g.pay_amount} {PAY_TYPES[g.pay_type]}</td>
                            <td>{g.openings}</td>
                            <td><span className="pill" style={{ background: 'var(--violet-soft)', color: 'var(--violet)' }}>{appCount} applied</span></td>
                            <td><span className={`st st-${g.status}`}>{g.status}</span></td>
                            <td>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => navigate('view', g.id)}
                              >
                                View Listing
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

        {/* Post a Gig Tab */}
        {activeTab === 'post' && (
          <div style={{ maxWidth: '720px' }}>
            <div className="main-head">
              <div>
                <h1>Post a New Gig</h1>
                <p className="muted">Students will see this opening immediately upon submission.</p>
              </div>
            </div>

            <div className="box">
              <form onSubmit={handlePostSubmit}>
                <label>Gig Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Billing Assistant, Evening Tutor"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <div className="grid2">
                  <div>
                    <label>Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      {GIG_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Locality / Area</label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid2">
                  <div>
                    <label>Pay Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Pay Frequency</label>
                    <select value={payType} onChange={(e) => setPayType(e.target.value)}>
                      {Object.entries(PAY_TYPES).map(([k, label]) => (
                        <option key={k} value={k}>{label.replace('/', 'Per ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid2">
                  <div>
                    <label>Schedule / Working Hours</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sat-Sun, 5 pm - 10 pm"
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Number of Openings</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={openings}
                      onChange={(e) => setOpenings(e.target.value)}
                    />
                  </div>
                </div>

                <label>Role Description &amp; Requirements</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mention key duties, required skills (e.g. Tally, Excel), and shift details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <button type="submit" className="btn btn-violet" style={{ marginTop: '12px' }}>
                  Publish Gig to Students 🚀
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Applicants Management Board */}
        {activeTab === 'applicants' && (
          <div>
            <div className="main-head">
              <div>
                <h1>Applicant Tracking Board</h1>
                <p className="muted">Shortlist candidates, conduct interviews, and hire directly.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ margin: 0, fontSize: '13px' }}>Filter by gig:</label>
                <select
                  value={selectedGigId}
                  onChange={(e) => setSelectedGigId(e.target.value)}
                  style={{ width: 'auto', marginBottom: 0 }}
                >
                  <option value="all">All Gigs ({myApplicants.length} applicants)</option>
                  {myGigs.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="board">
              {['applied', 'shortlisted', 'hired', 'rejected'].map(colStatus => {
                const colApps = myApplicants.filter(a => {
                  const gigMatches = selectedGigId === 'all' || a.gig_id === parseInt(selectedGigId, 10);
                  return gigMatches && a.status === colStatus;
                });

                const titles = {
                  applied: 'Applied',
                  shortlisted: 'Shortlisted',
                  hired: 'Hired 🎉',
                  rejected: 'Rejected',
                };

                return (
                  <div key={colStatus} className="lane">
                    <h4>
                      {titles[colStatus]}
                      <span>{colApps.length}</span>
                    </h4>

                    {colApps.length === 0 ? (
                      <div className="lane-empty">No candidates</div>
                    ) : (
                      colApps.map(app => {
                        const student = users.find(u => u.id === app.student_id);
                        const gig = gigs.find(g => g.id === app.gig_id);

                        return (
                          <div key={app.id} className="kcard">
                            <h5>{student?.full_name || 'Student Candidate'}</h5>
                            <div className="muted" style={{ fontSize: '12px' }}>
                              🎓 {student?.course} (Year {student?.study_year})
                            </div>
                            <div style={{ fontSize: '12px', background: 'var(--bg)', padding: '6px 10px', borderRadius: '10px', margin: '8px 0' }}>
                              <strong>Applied for:</strong> {gig?.title}
                            </div>
                            <p style={{ fontSize: '13px', margin: '6px 0', fontStyle: 'italic' }}>
                              "{app.message}"
                            </p>
                            <div className="muted" style={{ fontSize: '11px' }}>
                              Skills: {student?.skills || 'Commerce fundamentals'}
                            </div>

                            {app.status === 'hired' ? (
                              <div className="hired-banner">
                                ✅ Candidate Hired!<br />
                                📞 <strong>Phone:</strong> {student?.phone}<br />
                                ✉️ <strong>Email:</strong> {student?.email}
                              </div>
                            ) : (
                              <div className="acts" style={{ marginTop: '12px' }}>
                                {app.status === 'applied' && (
                                  <button
                                    className="btn btn-violet btn-sm"
                                    onClick={() => handleStatusChange(app.id, 'shortlisted')}
                                  >
                                    Shortlist ⭐
                                  </button>
                                )}
                                {app.status === 'shortlisted' && (
                                  <button
                                    className="btn btn-lime btn-sm"
                                    onClick={() => handleStatusChange(app.id, 'hired')}
                                  >
                                    Hire Now 🎉
                                  </button>
                                )}
                                {app.status !== 'rejected' && (
                                  <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => handleStatusChange(app.id, 'rejected')}
                                    style={{ fontSize: '11px', padding: '4px 8px' }}
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            )}
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

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '640px' }}>
            <div className="main-head">
              <div>
                <h1>Business Profile</h1>
                <p className="muted">Your verified details shown to college applicants.</p>
              </div>
            </div>

            <div className="box">
              <label>Business Name</label>
              <input type="text" readOnly value={employer?.business_name || ''} style={{ background: 'var(--bg)' }} />

              <div className="grid2">
                <div>
                  <label>Business Type</label>
                  <input type="text" readOnly value={employer?.business_type || ''} style={{ background: 'var(--bg)' }} />
                </div>
                <div>
                  <label>Verification Status</label>
                  <input type="text" readOnly value={employer?.status?.toUpperCase() || ''} style={{ background: 'var(--bg)' }} />
                </div>
              </div>

              <label>Address</label>
              <input type="text" readOnly value={employer?.address || ''} style={{ background: 'var(--bg)' }} />

              <label>About Business</label>
              <textarea readOnly rows={3} value={employer?.about || ''} style={{ background: 'var(--bg)' }} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

