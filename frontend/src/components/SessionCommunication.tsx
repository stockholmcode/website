import React, { useState } from 'react';
import styled from 'styled-components';
import ChatWindow from './ChatWindow';
import SessionPlanForm from './SessionPlanForm';
import { Session } from '../types/session';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SessionInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
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
`;

const DetailValue = styled.span`
  font-weight: 500;
  color: #333;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px 4px 0 0;
  
  &:hover {
    background: ${props => props.active ? '#007bff' : '#f8f9fa'};
  }
`;

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SingleColumnContent = styled.div`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

interface SessionCommunicationProps {
  session: Session;
  currentUserId: string;
  userType: 'teacher' | 'learner';
}

const SessionCommunication: React.FC<SessionCommunicationProps> = ({ 
  session, 
  currentUserId, 
  userType 
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'plan'>('chat');
  
  const otherUserId = userType === 'teacher' ? session.learnerId : session.teacherId;
  const otherUserRole = userType === 'teacher' ? 'Learner' : 'Teacher';

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container>
      <Title>Session Communication</Title>
      
      <SessionInfo>
        <h4>Session Details</h4>
        <SessionDetails>
          <DetailItem>
            <DetailLabel>Session ID</DetailLabel>
            <DetailValue>{session.id}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Skill</DetailLabel>
            <DetailValue>{session.skillName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Status</DetailLabel>
            <DetailValue>{session.status}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Format</DetailLabel>
            <DetailValue>{session.format}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Start Time</DetailLabel>
            <DetailValue>{formatDateTime(session.startTime)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>End Time</DetailLabel>
            <DetailValue>{formatDateTime(session.endTime)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Teacher ID</DetailLabel>
            <DetailValue>{session.teacherId}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Learner ID</DetailLabel>
            <DetailValue>{session.learnerId}</DetailValue>
          </DetailItem>
        </SessionDetails>
      </SessionInfo>

      <TabContainer>
        <Tab 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat & Messages
        </Tab>
        <Tab 
          active={activeTab === 'plan'} 
          onClick={() => setActiveTab('plan')}
        >
          📋 Session Planning
        </Tab>
      </TabContainer>

      {activeTab === 'chat' ? (
        <ContentArea>
          <SingleColumnContent>
            <ChatWindow
              sessionId={session.id}
              currentUserId={currentUserId}
              otherUserId={otherUserId}
              otherUserName={`${otherUserRole} ${otherUserId}`}
            />
          </SingleColumnContent>
        </ContentArea>
      ) : (
        <ContentArea>
          <SingleColumnContent>
            <SessionPlanForm
              sessionId={session.id}
              userId={currentUserId}
            />
          </SingleColumnContent>
        </ContentArea>
      )}
    </Container>
  );
};

export default SessionCommunication;