import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from '../components/Navigation';
import SkillSearch from '../components/SkillSearch';
import SessionBookingForm from '../components/SessionBookingForm';
import SessionList from '../components/SessionList';
import EnhancedSessionCommunication from '../components/EnhancedSessionCommunication';
import TeacherDashboard from '../components/TeacherDashboard';
import LearnerDashboard from '../components/LearnerDashboard';
import { Session, User } from '../types/session';

const AppContainer = styled.div`
  min-height: 100vh;
`;

const Content = styled.main`
  padding: 0 1rem;
`;

interface AuthenticatedAppProps {
  user: User;
  onLogout: () => void;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState<any>(null);

  // Get initial search parameters from URL if coming from landing page
  const urlParams = new URLSearchParams(location.search);
  const initialSkill = urlParams.get('skill') || '';
  const initialLocation = urlParams.get('location') || '';

  const getCurrentView = () => {
    const path = location.pathname;
    if (path.startsWith('/search')) return 'search';
    if (path.startsWith('/book')) return 'book';
    if (path.startsWith('/sessions')) return 'sessions';
    if (path.startsWith('/communication')) return 'communication';
    if (path.startsWith('/dashboard')) return 'dashboard';
    return 'search'; // default
  };

  const handleViewChange = (view: string) => {
    switch (view) {
      case 'search':
        navigate('/search');
        break;
      case 'book':
        navigate('/book');
        break;
      case 'sessions':
        navigate('/sessions');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      default:
        navigate('/search');
    }
  };

  const handleOpenCommunication = (session: Session) => {
    setSelectedSession(session);
    navigate(`/communication/${session.id}`);
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
    if (user?.userType === 'learner') {
      navigate('/sessions');
    } else {
      navigate('/dashboard');
    }
  };

  const handleTeacherSelect = (teacherId: string, teacherData?: any) => {
    setSelectedTeacher(teacherId);
    setSelectedTeacherData(teacherData);
    navigate('/book');
  };

  return (
    <AppContainer>
      <Navigation
        currentView={getCurrentView()}
        onViewChange={handleViewChange}
        userType={user?.userType || null}
        userId={user?.id || ''}
        user={user}
        onLogout={onLogout}
      />
      <Content>
        {/* Debug info - remove after testing */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '0.5rem', 
            margin: '0 1rem 1rem', 
            fontSize: '0.8rem',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <strong>Debug:</strong> path={location.pathname} | userType={user?.userType} | userName={user?.name}
          </div>
        )}
        
        <Routes>
          {/* Default route - redirect based on user type */}
          <Route 
            path="/" 
            element={
              <Navigate 
                to={user?.userType === 'teacher' ? '/dashboard' : '/search'} 
                replace 
              />
            } 
          />

          {/* Search route */}
          <Route 
            path="/search" 
            element={
              <SkillSearch 
                onTeacherSelect={handleTeacherSelect} 
                initialSkill={initialSkill} 
                initialLocation={initialLocation} 
              />
            } 
          />

          {/* Booking route */}
          <Route 
            path="/book" 
            element={
              <SessionBookingForm 
                selectedTeacher={selectedTeacher} 
                selectedTeacherData={selectedTeacherData}
                currentUserId={user?.id || ''} 
                onSessionBooked={() => navigate('/sessions')} 
              />
            } 
          />

          {/* Sessions route */}
          <Route 
            path="/sessions" 
            element={
              user?.userType === 'learner' ? (
                <LearnerDashboard 
                  learnerId={user.id} 
                  onOpenCommunication={handleOpenCommunication}
                />
              ) : (
                <SessionList 
                  userType={user?.userType || 'learner'} 
                  userId={user?.id || ''} 
                  onOpenCommunication={handleOpenCommunication}
                />
              )
            } 
          />

          {/* Communication route */}
          <Route 
            path="/communication/:sessionId" 
            element={
              selectedSession ? (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <button 
                      onClick={handleBackToSessions}
                      style={{
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      ← Back to {user?.userType === 'learner' ? 'My Sessions' : 'Dashboard'}
                    </button>
                  </div>
                  <EnhancedSessionCommunication 
                    session={selectedSession}
                    currentUserId={user?.id || ''}
                    userType={user?.userType || 'learner'}
                    onSessionUpdate={(updatedSession) => setSelectedSession(updatedSession)}
                  />
                </>
              ) : (
                <Navigate to="/sessions" replace />
              )
            } 
          />

          {/* Dashboard route (teachers only) */}
          <Route 
            path="/dashboard" 
            element={
              user?.userType === 'teacher' ? (
                <TeacherDashboard 
                  teacherId={user.id} 
                  onOpenCommunication={handleOpenCommunication} 
                />
              ) : (
                <Navigate to="/search" replace />
              )
            } 
          />

          {/* Fallback route */}
          <Route 
            path="*" 
            element={
              <Navigate 
                to={user?.userType === 'teacher' ? '/dashboard' : '/search'} 
                replace 
              />
            } 
          />
        </Routes>
      </Content>
    </AppContainer>
  );
};

export default AuthenticatedApp;