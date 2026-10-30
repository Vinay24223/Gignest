import React, { useState } from 'react';
import { useGigNest } from '../context/GigNestContext';

export default function JoinView() {
  const { registerUser, navigate } = useGigNest();
  const [role, setRole] = useState('student');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Student fields
  const [course, setCourse] = useState('BCom');
  const [studyYear, setStudyYear] = useState('2');
  const [skills, setSkills] = useState('');
  // Employer fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Cafe');
  const [area, setArea] = useState('Model Town');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({
      full_name: fullName,
      email,
      phone,
      role,
      course,
      study_year: studyYear,
      skills,
      business_name: businessName,
      business_type: businessType,
      area,
      address,
      about,
    });
  };

  return (
    <div className="auth">
      <div className="auth-side">
        <div className="logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-mark"></span>
          Gig<b>Nest</b>
        </div>

        <div>
          <h2>Join GigNest today</h2>
          <p style={{ opacity: 0.9, fontSize: '16px', marginTop: '10px' }}>
            {role === 'student'
              ? 'Join as a student to discover verified local work, build your work experience, and earn extra income alongside your classes.'
              : 'Register your business to find dedicated, hardworking college students for temporary shifts, tutoring, and events.'}
          </p>
          <ul>
            <li>No sign-up fee or placement commission.</li>
            <li>Direct coordination and verified contact details.</li>
            <li>Instant setup and active community.</li>
          </ul>
        </div>

        <div style={{ fontSize: '13px', opacity: 0.8 }}>
          Minor Project · React SPA
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-box">
          <h1>Create your account</h1>
          <p className="muted">Select how you want to use GigNest:</p>

          <div className="role-cards">
            <button
              type="button"
              className={role === 'student' ? 'on' : ''}
              onClick={() => setRole('student')}
            >
              <b>🎓 I am a Student</b>
              <span>Find part-time work</span>
            </button>
            <button
              type="button"
              className={role === 'employer' ? 'on' : ''}
              onClick={() => setRole('employer')}
            >
              <b>🏪 I am an Employer</b>
              <span>Hire students</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid2">
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vinay Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. yourname@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {role === 'student' ? (
              <>
                <div className="grid2">
                  <div>
                    <label>Degree / Course</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)}>
                      <option value="BCom">BCom (General)</option>
                      <option value="BCom (Hons)">BCom (Hons)</option>
                      <option value="BBA">BBA</option>
                      <option value="BCA">BCA</option>
                      <option value="BA">BA</option>
                    </select>
                  </div>
                  <div>
                    <label>Current Year</label>
                    <select value={studyYear} onChange={(e) => setStudyYear(e.target.value)}>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <label>Key Skills</label>
                <input
                  type="text"
                  placeholder="e.g. Tally Prime, MS Excel, Hindi Typing, Billing"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <div className="hint">Helps local businesses shortlist your profile faster.</div>
              </>
            ) : (
              <>
                <div className="grid2">
                  <div>
                    <label>Business Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunrise Cafe"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Business Type</label>
                    <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                      <option value="Cafe">Cafe / Restaurant</option>
                      <option value="Coaching centre">Coaching / Tuition Centre</option>
                      <option value="Retail shop">Retail Store / Shop</option>
                      <option value="Event company">Events &amp; Marketing</option>
                      <option value="Office">Office / Accounting Firm</option>
                    </select>
                  </div>
                </div>

                <div className="grid2">
                  <div>
                    <label>Locality / Area</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Model Town"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Shop / Office Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Shop 4, Main Market"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <label>Brief Description of Business</label>
                <textarea
                  rows={3}
                  placeholder="Describe your establishment and type of shifts you offer..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </>
            )}

            <button type="submit" className="btn btn-violet btn-block" style={{ marginTop: '12px' }}>
              Complete Registration 🚀
            </button>
          </form>

          <p className="center muted" style={{ fontSize: '14px', marginTop: '20px' }}>
            Already have an account?{' '}
            <strong style={{ color: 'var(--violet)', cursor: 'pointer' }} onClick={() => navigate('signin')}>
              Sign in
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

