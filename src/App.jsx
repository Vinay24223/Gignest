import React from 'react';
import { useGigNest } from './context/GigNestContext';
import DemoBar from './components/DemoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomeView from './views/HomeView';
import ExploreView from './views/ExploreView';
import GigDetailView from './views/GigDetailView';
import SignInView from './views/SignInView';
import JoinView from './views/JoinView';
import HowItWorksView from './views/HowItWorksView';
import HelpView from './views/HelpView';
import StudentDashboardView from './views/StudentDashboardView';
import EmployerDashboardView from './views/EmployerDashboardView';
import AdminDashboardView from './views/AdminDashboardView';

export default function App() {
  const { currentView, notification } = useGigNest();

  const isAuthView = currentView === 'signin' || currentView === 'join';
  const isDashboardView =
    currentView === 'student-dashboard' ||
    currentView === 'employer-dashboard' ||
    currentView === 'admin-dashboard';

  return (
    <div className="app-container">
      {/* Top Demo Helper Bar */}
      <DemoBar />

      {/* Public Topnav (hidden in Auth and Dashboard views) */}
      {!isAuthView && !isDashboardView && <Navbar />}

      {/* Main Routed View */}
      {currentView === 'home' && <HomeView />}
      {currentView === 'explore' && <ExploreView />}
      {currentView === 'view' && <GigDetailView />}
      {currentView === 'signin' && <SignInView />}
      {currentView === 'join' && <JoinView />}
      {currentView === 'how-it-works' && <HowItWorksView />}
      {currentView === 'help' && <HelpView />}
      {currentView === 'student-dashboard' && <StudentDashboardView />}
      {currentView === 'employer-dashboard' && <EmployerDashboardView />}
      {currentView === 'admin-dashboard' && <AdminDashboardView />}

      {/* Footer (shown on public pages) */}
      {!isAuthView && !isDashboardView && <Footer />}

      {/* Floating Toast Notification */}
      {notification && (
        <div className={`toast toast-${notification.type}`}>
          <span>{notification.type === 'ok' ? '✓' : notification.type === 'err' ? '✕' : 'ℹ'}</span>
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}
