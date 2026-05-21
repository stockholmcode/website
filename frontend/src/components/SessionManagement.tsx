import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { sessionAPI } from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
`;

const SessionCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SessionTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  
  ${props => {
    switch (props.status) {
      case 'PENDING':
        return 'background: #ffc107;';
      case 'CONFIRMED':
        return 'background: #28a745;';
      case 'COMPLETED':
        return 'background: #6c757d;';
      case 'CANCELLED':
        return 'background: #dc3545;';
      default:
        return 'background: #6c757d;';
    }
  }}
`;

const SessionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
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
  
  &:disabled {
    background: #dee2e6;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 1rem 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 1rem 0;
  min-height: 100px;
  resize: vertical;
`;

interface Session {
  id: string;
  skillName: string;
  startTime: string;
  endTime: string;
  status: string;
  format: string;
  price: number;
  location?: string;
  virtualMeetingUrl?: string;
  teacherId: string;
  learnerId: string;
}

const SessionManagement: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [newDateTime, setNewDateTime] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // Mock data - in real app would fetch from API
      const mockSessions: Session[] = [
        {
          id: '1',
          skillName: 'Guitar Basics',
          startTime: '2025-05-25T10:00',
          endTime: '2025-05-25T11:00',
          status: 'CONFIRMED',
          format: 'IN_PERSON',
          price: 50,
          location: '123 Music St, City',
          teacherId: '1',
          learnerId: '2'
        },
        {
          id: '2',
          skillName: 'Python Programming',
          startTime: '2025-05-26T14:00',
          endTime: '2025-05-26T16:00',
          status: 'PENDING',
          format: 'ONLINE',
          price: 75,
          virtualMeetingUrl: 'https://meet.google.com/abc-def-ghi',
          teacherId: '3',
          learnerId: '2'
        }
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (session: Session) => {
    setSelectedSession(session);
    setShowCancelModal(true);
  };

  const handleReschedule = (session: Session) => {
    setSelectedSession(session);
    setNewDateTime(session.startTime);
    setShowRescheduleModal(true);
  };

  const confirmCancellation = async () => {
    if (!selectedSession) return;
    
    try {
      await sessionAPI.cancelSession(selectedSession.id, { reason: cancellationReason });
      setSessions(prev => prev.map(s => 
        s.id === selectedSession.id ? { ...s, status: 'CANCELLED' } : s
      ));
      setShowCancelModal(false);
      setCancellationReason('');
    } catch (error) {
      console.error('Failed to cancel session:', error);
    }
  };

  const confirmReschedule = async () => {
    if (!selectedSession || !newDateTime) return;
    
    try {
      // Mock reschedule - in real app would call API
      const endTime = new Date(new Date(newDateTime).getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);
      setSessions(prev => prev.map(s => 
        s.id === selectedSession.id 
          ? { ...s, startTime: newDateTime, endTime }
          : s
      ));
      setShowRescheduleModal(false);
      setNewDateTime('');
    } catch (error) {
      console.error('Failed to reschedule session:', error);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Container>Loading sessions...</Container>;
  }

  return (
    <Container>
      <Title>My Sessions</Title>
      
      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        sessions.map(session => (
          <SessionCard key={session.id}>
            <SessionHeader>
              <SessionTitle>{session.skillName}</SessionTitle>
              <StatusBadge status={session.status}>{session.status}</StatusBadge>
            </SessionHeader>
            
            <SessionDetails>
              <DetailItem>
                <DetailLabel>Start:</DetailLabel> {formatDateTime(session.startTime)}
              </DetailItem>
              <DetailItem>
                <DetailLabel>End:</DetailLabel> {formatDateTime(session.endTime)}
              </DetailItem>
              <DetailItem>
                <DetailLabel>Format:</DetailLabel> {session.format}
              </DetailItem>
              <DetailItem>
                <DetailLabel>Price:</DetailLabel> ${session.price}
              </DetailItem>
              {session.location && (
                <DetailItem>
                  <DetailLabel>Location:</DetailLabel> {session.location}
                </DetailItem>
              )}
              {session.virtualMeetingUrl && (
                <DetailItem>
                  <DetailLabel>Meeting URL:</DetailLabel>{' '}
                  <a href={session.virtualMeetingUrl} target="_blank" rel="noopener noreferrer">
                    Join Meeting
                  </a>
                </DetailItem>
              )}
            </SessionDetails>
            
            <ActionButtons>
              {session.status === 'CONFIRMED' && (
                <>
                  <Button variant="primary" onClick={() => handleReschedule(session)}>
                    Reschedule
                  </Button>
                  <Button variant="danger" onClick={() => handleCancel(session)}>
                    Cancel
                  </Button>
                </>
              )}
              {session.status === 'PENDING' && (
                <Button variant="danger" onClick={() => handleCancel(session)}>
                  Cancel
                </Button>
              )}
            </ActionButtons>
          </SessionCard>
        ))
      )}

      {showCancelModal && (
        <Modal onClick={() => setShowCancelModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>Cancel Session</h3>
            <p>Please provide a reason for cancellation:</p>
            <TextArea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Reason for cancellation..."
            />
            <ActionButtons>
              <Button onClick={() => setShowCancelModal(false)}>
                Keep Session
              </Button>
              <Button variant="danger" onClick={confirmCancellation}>
                Cancel Session
              </Button>
            </ActionButtons>
          </ModalContent>
        </Modal>
      )}

      {showRescheduleModal && (
        <Modal onClick={() => setShowRescheduleModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>Reschedule Session</h3>
            <p>Select a new date and time:</p>
            <Input
              type="datetime-local"
              value={newDateTime}
              onChange={(e) => setNewDateTime(e.target.value)}
            />
            <ActionButtons>
              <Button onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmReschedule}>
                Reschedule
              </Button>
            </ActionButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default SessionManagement;