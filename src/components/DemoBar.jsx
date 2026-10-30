import React from 'react';
import { useGigNest } from '../context/GigNestContext';

export default function DemoBar() {
  const { currentUser, switchDemoRole, logout, resetToDemo } = useGigNest();

  return (
    <div className="demo-bar">
      <div>
        <strong>⚡ Live Interactive Demo</strong> &nbsp;|&nbsp;
        <span>
          Current User: <strong>{currentUser ? `${currentUser.full_name} (${currentUser.role})` : 'Guest (Logged Out)'}</strong>
        </span>
      </div>

      <div className="demo-bar-actions">
        <span>Quick Switch:</span>
        <button
          className={`demo-pill ${currentUser?.role === 'student' ? 'active' : ''}`}
          onClick={() => switchDemoRole('student')}
        >
          🎓 Student
        </button>
        <button
          className={`demo-pill ${currentUser?.role === 'employer' ? 'active' : ''}`}
          onClick={() => switchDemoRole('employer')}
        >
          🏪 Employer
        </button>
        <button
          className={`demo-pill ${currentUser?.role === 'admin' ? 'active' : ''}`}
          onClick={() => switchDemoRole('admin')}
        >
          🛡️ Admin
        </button>
        {currentUser && (
          <button className="demo-pill" onClick={logout}>
            Sign Out
          </button>
        )}
        <button className="demo-pill" onClick={resetToDemo} title="Reset all data to default">
          🔄 Reset Data
        </button>
      </div>
    </div>
  );
}

