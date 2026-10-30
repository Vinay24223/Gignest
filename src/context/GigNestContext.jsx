import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_EMPLOYERS,
  INITIAL_GIGS,
  INITIAL_APPLICATIONS,
  INITIAL_SAVED,
} from '../data/initialData';

const GigNestContext = createContext();

const STORAGE_KEY_PREFIX = 'gignest_v1_';

function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(e);
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

export function GigNestProvider({ children }) {
  const [users, setUsers] = useState(() => getStored('users', INITIAL_USERS));
  const [employers, setEmployers] = useState(() => getStored('employers', INITIAL_EMPLOYERS));
  const [gigs, setGigs] = useState(() => getStored('gigs', INITIAL_GIGS));
  const [applications, setApplications] = useState(() => getStored('applications', INITIAL_APPLICATIONS));
  const [savedGigIds, setSavedGigIds] = useState(() => getStored('saved', INITIAL_SAVED));

  // Current logged in user (default to student 104 Riya Sharma for rich demo out of the box, or null)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = getStored('currentUser', null);
    if (saved) return saved;
    // Default logged in as Student Riya Sharma for instant exploration
    return INITIAL_USERS.find(u => u.id === 104) || null;
  });

  // Active page state for SPA navigation without reload issues
  // view: 'home' | 'explore' | 'view' | 'how-it-works' | 'help' | 'signin' | 'join' | 'student-dashboard' | 'employer-dashboard' | 'admin-dashboard'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    return hash || 'home';
  });
  const [activeGigId, setActiveGigId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => setStored('users', users), [users]);
  useEffect(() => setStored('employers', employers), [employers]);
  useEffect(() => setStored('gigs', gigs), [gigs]);
  useEffect(() => setStored('applications', applications), [applications]);
  useEffect(() => setStored('saved', savedGigIds), [savedGigIds]);
  useEffect(() => setStored('currentUser', currentUser), [currentUser]);

  // Handle URL hash changes
  useEffect(() => {
    const onHashChange = () => {
      const parts = window.location.hash.replace('#/', '').replace('#', '').split('/');
      const page = parts[0] || 'home';
      setCurrentView(page);
      if (parts[1]) {
        setActiveGigId(parseInt(parts[1], 10));
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (view, gigId = null) => {
    setCurrentView(view);
    if (gigId) {
      setActiveGigId(gigId);
      window.location.hash = `#/${view}/${gigId}`;
    } else {
      window.location.hash = `#/${view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, type = 'ok') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Auth methods
  const login = (email) => {
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      showToast('Account not found with this email. Try demo accounts below!', 'err');
      return false;
    }
    setCurrentUser(user);
    showToast(`Signed in as ${user.full_name}`, 'ok');
    if (user.role === 'admin') navigate('admin-dashboard');
    else if (user.role === 'employer') navigate('employer-dashboard');
    else navigate('student-dashboard');
    return true;
  };

  const switchDemoRole = (role) => {
    let targetUser = null;
    if (role === 'student') targetUser = users.find(u => u.role === 'student');
    else if (role === 'employer') targetUser = users.find(u => u.role === 'employer' && u.id === 101);
    else if (role === 'admin') targetUser = users.find(u => u.role === 'admin');

    if (targetUser) {
      setCurrentUser(targetUser);
      showToast(`Switched view to ${targetUser.role.toUpperCase()} (${targetUser.full_name})`, 'ok');
      if (role === 'admin') navigate('admin-dashboard');
      else if (role === 'employer') navigate('employer-dashboard');
      else navigate('student-dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully.', 'ok');
    navigate('home');
  };

  const registerUser = ({ full_name, email, phone, role, course, study_year, skills, business_name, business_type, area, address, about }) => {
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      showToast('Email already in use. Please sign in.', 'err');
      return false;
    }

    const newUserId = Math.max(...users.map(u => u.id), 100) + 1;
    const newUser = {
      id: newUserId,
      email: email.trim(),
      role,
      full_name: full_name.trim(),
      phone: phone.trim(),
      course: course || null,
      study_year: study_year ? parseInt(study_year, 10) : null,
      skills: skills || null,
    };

    setUsers(prev => [...prev, newUser]);

    if (role === 'employer') {
      const newEmployerId = Math.max(...employers.map(e => e.id), 0) + 1;
      const newEmployer = {
        id: newEmployerId,
        user_id: newUserId,
        business_name: business_name || full_name,
        business_type: business_type || 'Local Business',
        area: area || 'Campus area',
        address: address || '',
        about: about || '',
        status: 'pending',
        admin_note: 'Awaiting admin verification.',
        verified_at: null,
      };
      setEmployers(prev => [...prev, newEmployer]);
    }

    setCurrentUser(newUser);
    showToast(`Welcome ${newUser.full_name}! Account created.`, 'ok');
    if (role === 'employer') navigate('employer-dashboard');
    else navigate('student-dashboard');
    return true;
  };

  // Gig bookmark / save toggle
  const toggleSave = (gigId) => {
    if (!currentUser) {
      showToast('Please sign in to save gigs.', 'warn');
      navigate('signin');
      return;
    }
    setSavedGigIds(prev => {
      const exists = prev.includes(gigId);
      const next = exists ? prev.filter(id => id !== gigId) : [...prev, gigId];
      showToast(exists ? 'Removed from saved gigs' : 'Saved to your shortlist ❤️', 'ok');
      return next;
    });
  };

  // Student application
  const applyForGig = (gigId, message) => {
    if (!currentUser) {
      showToast('Please sign in as a student to apply.', 'warn');
      navigate('signin');
      return false;
    }
    if (currentUser.role !== 'student') {
      showToast('Only student accounts can apply for gigs.', 'warn');
      return false;
    }

    const alreadyApplied = applications.some(a => a.gig_id === gigId && a.student_id === currentUser.id);
    if (alreadyApplied) {
      showToast('You have already applied for this gig.', 'warn');
      return false;
    }

    const newAppId = Math.max(...applications.map(a => a.id), 0) + 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newApp = {
      id: newAppId,
      gig_id: gigId,
      student_id: currentUser.id,
      message: message.trim(),
      status: 'applied',
      applied_at: nowStr,
      log: [
        { status: 'applied', note: 'You submitted your application.', time: nowStr }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    showToast('Application sent! You can track it on your board.', 'ok');
    return true;
  };

  // Post new gig (employer)
  const postGig = (gigData) => {
    const employer = employers.find(e => e.user_id === currentUser?.id);
    if (!employer) {
      showToast('Employer record not found.', 'err');
      return false;
    }
    if (employer.status !== 'verified') {
      showToast('Cannot post gig. Your business is pending verification by the admin.', 'err');
      return false;
    }

    const newGigId = Math.max(...gigs.map(g => g.id), 0) + 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newGig = {
      id: newGigId,
      employer_id: employer.id,
      title: gigData.title.trim(),
      description: gigData.description.trim(),
      category: gigData.category,
      area: gigData.area.trim(),
      pay_amount: parseFloat(gigData.pay_amount),
      pay_type: gigData.pay_type,
      schedule: gigData.schedule.trim(),
      openings: parseInt(gigData.openings, 10) || 1,
      status: 'open',
      created_at: nowStr,
      end_date: gigData.end_date || '2026-12-31',
    };

    setGigs(prev => [newGig, ...prev]);
    showToast('Gig posted successfully and is now visible to students!', 'ok');
    return true;
  };

  // Move applicant status
  const updateApplicationStatus = (appId, newStatus, note = '') => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        status: newStatus,
        log: [
          ...app.log,
          { status: newStatus, note: note || `Status updated to ${newStatus}.`, time: nowStr }
        ]
      };
    }));
    showToast(`Applicant moved to ${newStatus.toUpperCase()}`, 'ok');
  };

  // Admin moderation
  const verifyEmployer = (employerId, status, note = '') => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setEmployers(prev => prev.map(emp => {
      if (emp.id !== employerId) return emp;
      return {
        ...emp,
        status,
        admin_note: note,
        verified_at: status === 'verified' ? nowStr : null,
      };
    }));
    showToast(`Employer status set to ${status.toUpperCase()}`, 'ok');
  };

  const updateGigStatus = (gigId, newStatus) => {
    setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: newStatus } : g));
    showToast(`Gig status updated to ${newStatus}`, 'ok');
  };

  // Reset to original demo data
  const resetToDemo = () => {
    setUsers(INITIAL_USERS);
    setEmployers(INITIAL_EMPLOYERS);
    setGigs(INITIAL_GIGS);
    setApplications(INITIAL_APPLICATIONS);
    setSavedGigIds(INITIAL_SAVED);
    setCurrentUser(INITIAL_USERS.find(u => u.id === 104));
    localStorage.clear();
    showToast('Demo data reset to default state.', 'ok');
    navigate('home');
  };

  // Get employer for a gig
  const getEmployerForGig = (gig) => {
    if (!gig) return null;
    return employers.find(e => e.id === gig.employer_id) || null;
  };

  // Helper stats
  const activeGigs = gigs.filter(g => {
    const emp = employers.find(e => e.id === g.employer_id);
    return g.status === 'open' && emp && emp.status === 'verified';
  });

  const verifiedEmployersCount = employers.filter(e => e.status === 'verified').length;
  const studentsCount = users.filter(u => u.role === 'student').length;
  const hiredCount = applications.filter(a => a.status === 'hired').length;

  return (
    <GigNestContext.Provider value={{
      users,
      employers,
      gigs,
      activeGigs,
      applications,
      savedGigIds,
      currentUser,
      currentView,
      activeGigId,
      notification,
      verifiedEmployersCount,
      studentsCount,
      hiredCount,
      navigate,
      login,
      logout,
      switchDemoRole,
      registerUser,
      toggleSave,
      applyForGig,
      postGig,
      updateApplicationStatus,
      verifyEmployer,
      updateGigStatus,
      resetToDemo,
      getEmployerForGig,
      showToast,
    }}>
      {children}
    </GigNestContext.Provider>
  );
}

export function useGigNest() {
  const context = useContext(GigNestContext);
  if (!context) throw new Error('useGigNest must be used within GigNestProvider');
  return context;
}

