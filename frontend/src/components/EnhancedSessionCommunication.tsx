import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatWindow from './ChatWindow';
import SessionPlanForm from './SessionPlanForm';
import SessionNotes from './SessionNotes';
import SessionControls from './SessionControls';
import FileSharing from './FileSharing';
import { Session, SessionStatus } from '../types/session';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin: 0;
`;

const SessionStatusBadge = styled.div<{ status: SessionStatus }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.875rem;
  background: ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#fff3cd';
      case SessionStatus.CONFIRMED: return '#cce5ff';
      case SessionStatus.IN_PROGRESS: return '#d4edda';
      case SessionStatus.COMPLETED: return '#e2e3e5';
      case SessionStatus.CANCELLED: return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#856404';
      case SessionStatus.CONFIRMED: return '#004085';
      case SessionStatus.IN_PROGRESS: return '#155724';
      case SessionStatus.COMPLETED: return '#383d41';
      case SessionStatus.CANCELLED: return '#721c24';
      default: return '#383d41';
    }
  }};
`;

const SessionInfo = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
`;

const SessionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  font-weight: 500;
  color: #333;
  font-size: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  border-bottom: 3px solid ${props => props.active ? '#007bff' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
    color: ${props => props.active ? 'white' : '#333'};
  }
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  min-height: 600px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MainContent = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TeacherToolbar = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ToolButton = styled.button<{ variant?: 'primary' | 'success' | 'warning' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
      case 'success':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
        `;
      case 'warning':
        return `
          background: #ffc107;
          color: #212529;
          &:hover { background: #e0a800; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #545b62; }
        `;
    }
  }}
`;

const QuickActions = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const QuickActionsTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
  }
`;

const ActionIcon = styled.span`
  font-size: 1.2rem;
`;

const ActionText = styled.div`
  flex: 1;
`;

const ActionLabel = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ActionDescription = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const SessionTimer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const TimerDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
`;

const TimerLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

interface EnhancedSessionCommunicationProps {
  session: Session;
  currentUserId: string;
  userType: 'teacher' | 'learner';
  onSessionUpdate?: (session: Session) => void;
}

const EnhancedSessionCommunication: React.FC<EnhancedSessionCommunicationProps> = ({ 
  session, 
  currentUserId, 
  userType,
  onSessionUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'plan' | 'notes' | 'files'>('chat');
  const [sessionTimer, setSessionTimer] = useState<string>('00:00:00');
  const [sessionStarted, setSessionStarted] = useState(session.status === SessionStatus.IN_PROGRESS);
  
  const otherUserId = userType === 'teacher' ? session.learnerId : session.teacherId;
  const otherUserRole = userType === 'teacher' ? 'Learner' : 'Teacher';
  const isTeacher = userType === 'teacher';

  // Timer effect for session duration
  useEffect(() => {
    if (sessionStarted && session.status === SessionStatus.IN_PROGRESS) {
      const interval = setInterval(() => {
        const start = new Date(session.startTime);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setSessionTimer(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionStarted, session.startTime, session.status]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStartSession = () => {
    setSessionStarted(true);
    // In real app, would call API to update session status
    const updatedSession = { ...session, status: SessionStatus.IN_PROGRESS };
    onSessionUpdate?.(updatedSession);
  };

  const handleEndSession = () => {
    setSessionStarted(false);
    // In real app, would call API to update session status
    const updatedSession = { ...session, status: SessionStatus.COMPLETED };
    onSessionUpdate?.(updatedSession);
  };

  const handleShareScreen = () => {
    // Implement screen sharing functionality
    alert('Screen sharing functionality would be implemented here');
  };

  const handleRecordSession = () => {
    // Implement session recording
    alert('Session recording functionality would be implemented here');
  };

  const handleSendLocation = () => {
    // Send current location to student
    alert('Location sharing functionality would be implemented here');
  };

  const handleEmergencyContact = () => {
    // Emergency contact functionality
    alert('Emergency contact functionality would be implemented here');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div style={{ height: '100%' }}>
            {isTeacher && (
              <TeacherToolbar>
                <ToolButton variant="primary" onClick={handleShareScreen}>
                  🖥️ Share Screen
                </ToolButton>
                <ToolButton variant="success" onClick={handleRecordSession}>
                  🎥 Record Session
                </ToolButton>
                <ToolButton variant="warning" onClick={handleSendLocation}>
                  📍 Send Location
                </ToolButton>
                <ToolButton variant="danger" onClick={handleEmergencyContact}>
                  🚨 Emergency
                </ToolButton>
              </TeacherToolbar>
            )}
            <ChatWindow
              sessionId={session.id}
              currentUserId={currentUserId}
              otherUserId={otherUserId}
              otherUserName={`${otherUserRole} ${otherUserId}`}
            />
          </div>
        );
      case 'plan':
        return (
          <SessionPlanForm
            sessionId={session.id}
            userId={currentUserId}
          />
        );
      case 'notes':
        return (
          <SessionNotes
            sessionId={session.id}
            userId={currentUserId}
            userType={userType}
          />
        );
      case 'files':
        return (
          <FileSharing
            sessionId={session.id}
            userId={currentUserId}
            userType={userType}
          />
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Session Communication</Title>
        <SessionStatusBadge status={session.status}>
          {session.status.replace('_', ' ')}
        </SessionStatusBadge>
      </Header>
      
      <SessionInfo>
        <SessionDetails>
          <DetailItem>
            <DetailLabel>Skill</DetailLabel>
            <DetailValue>{session.skillName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Student</DetailLabel>
            <DetailValue>{isTeacher ? `Learner ${session.learnerId}` : `Teacher ${session.teacherId}`}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Format</DetailLabel>
            <DetailValue>{session.format}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Schedule</DetailLabel>
            <DetailValue>{formatDateTime(session.startTime)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Duration</DetailLabel>
            <DetailValue>1 hour</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Price</DetailLabel>
            <DetailValue>${session.price}</DetailValue>
          </DetailItem>
        </SessionDetails>
      </SessionInfo>

      <TabContainer>
        <Tab 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')}
        >
          💬 Live Chat
        </Tab>
        <Tab 
          active={activeTab === 'plan'} 
          onClick={() => setActiveTab('plan')}
        >
          📋 Session Plan
        </Tab>
        {isTeacher && (
          <>
            <Tab 
              active={activeTab === 'notes'} 
              onClick={() => setActiveTab('notes')}
            >
              📝 Teaching Notes
            </Tab>
            <Tab 
              active={activeTab === 'files'} 
              onClick={() => setActiveTab('files')}
            >
              📁 Files & Materials
            </Tab>
          </>
        )}
      </TabContainer>

      <ContentArea>
        <MainContent>
          {renderMainContent()}
        </MainContent>
        
        <SidePanel>
          {isTeacher && (
            <SessionControls
              session={session}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
              sessionStarted={sessionStarted}
            />
          )}
          
          <SessionTimer>
            <TimerDisplay>{sessionTimer}</TimerDisplay>
            <TimerLabel>Session Duration</TimerLabel>
          </SessionTimer>
          
          <QuickActions>
            <QuickActionsTitle>Quick Actions</QuickActionsTitle>
            
            <ActionButton onClick={handleSendLocation}>
              <ActionIcon>📍</ActionIcon>
              <ActionText>
                <ActionLabel>Share Location</ActionLabel>
                <ActionDescription>Send your current location</ActionDescription>
              </ActionText>
            </ActionButton>
            
            <ActionButton onClick={handleEmergencyContact}>
              <ActionIcon>🚨</ActionIcon>
              <ActionText>
                <ActionLabel>Emergency Contact</ActionLabel>
                <ActionDescription>Get help immediately</ActionDescription>
              </ActionText>
            </ActionButton>
            
            {isTeacher && (
              <>
                <ActionButton onClick={handleShareScreen}>
                  <ActionIcon>🖥️</ActionIcon>
                  <ActionText>
                    <ActionLabel>Share Screen</ActionLabel>
                    <ActionDescription>Show your screen to student</ActionDescription>
                  </ActionText>
                </ActionButton>
                
                <ActionButton onClick={handleRecordSession}>
                  <ActionIcon>🎥</ActionIcon>
                  <ActionText>
                    <ActionLabel>Record Session</ActionLabel>
                    <ActionDescription>Save session for review</ActionDescription>
                  </ActionText>
                </ActionButton>
              </>
            )}
          </QuickActions>
        </SidePanel>
      </ContentArea>
    </Container>
  );
};

export default EnhancedSessionCommunication;