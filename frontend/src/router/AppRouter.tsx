import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, UserType } from '../types/session';
import LandingPage from '../components/LandingPage';
import LoginPage from '../components/LoginPage';
import SignUpPage from '../components/SignUpPage';
import SkillSearch from '../components/SkillSearch';
import AuthenticatedApp from './AuthenticatedApp';

// Component for handling public routes (unauthenticated users)
const PublicRoutes: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <Routes>
      <Route 
        path="/search" 
        element={
          <SkillSearch 
            onTeacherSelect={(teacherId, teacherData) => {
              // For unauthenticated users, redirect to login when trying to book
              navigate('/login');
            }} 
            initialSkill={new URLSearchParams(window.location.search).get('skill') || ''} 
            initialLocation={new URLSearchParams(window.location.search).get('location') || ''} 
            isAuthenticated={false}
          />
        } 
      />
      {/* Redirect all other routes to login */}
      <Route path="/*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Wrapper component to use navigation hooks
const AppRoutes: React.FC<{
  user: User | null;
  onLogin: (userType: UserType, userData: User) => void;
  onSignUp: (userType: UserType, userData: User) => void;
  onLogout: () => void;
  onSkillSearch: (skill: string, location: string) => void;
}> = ({ user, onLogin, onSignUp, onLogout, onSkillSearch }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          <LandingPage 
            onLogin={() => navigate('/login')}
            onSignUp={() => navigate('/signup')}
            onSkillSearch={onSkillSearch}
          />
        } 
      />
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to={user.userType === 'teacher' ? '/dashboard' : '/search'} replace />
          ) : (
            <LoginPage 
              onLogin={onLogin}
              onBackToHome={() => navigate('/')}
              onGoToSignUp={() => navigate('/signup')}
            />
          )
        } 
      />
      <Route 
        path="/signup" 
        element={
          user ? (
            <Navigate to={user.userType === 'teacher' ? '/dashboard' : '/search'} replace />
          ) : (
            <SignUpPage 
              onSignUp={onSignUp}
              onBackToLogin={() => navigate('/login')}
            />
          )
        } 
      />

      {/* All other routes - handle both authenticated and public search */}
      <Route 
        path="/*" 
        element={
          user ? (
            <AuthenticatedApp 
              user={user} 
              onLogout={onLogout}
            />
          ) : (
            // For unauthenticated users, only allow search, redirect others to login
            <PublicRoutes navigate={navigate} />
          )
        } 
      />
    </Routes>
  );
};

interface AppRouterProps {
  user: User | null;
  onLogin: (userType: UserType, userData: User) => void;
  onSignUp: (userType: UserType, userData: User) => void;
  onLogout: () => void;
  onSkillSearch: (skill: string, location: string) => void;
}

const AppRouter: React.FC<AppRouterProps> = (props) => {
  return (
    <Router>
      <AppRoutes {...props} />
    </Router>
  );
};

export default AppRouter;