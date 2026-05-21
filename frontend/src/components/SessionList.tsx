import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Session, SessionStatus } from '../types/session';
import { sessionAPI } from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
`;

const SessionCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#ddd'};
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SessionTitle = styled.h3`
  color: #333;
  margin: 0;
`;

const StatusBadge = styled.span<{ status: SessionStatus }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background: ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#ffc107';
      case SessionStatus.CONFIRMED: return '#28a745';
      case SessionStatus.COMPLETED: return '#6c757d';
      case SessionStatus.CANCELLED: return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const SessionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'success' | 'danger' | 'info' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      case 'info':
        return `
          background: #17a2b8;
          color: white;
          &:hover { background: #138496; }
        `;
      default:
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
    }
  }}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

interface SessionListProps {
  userType: 'teacher' | 'learner';
  userId: string;
  onOpenCommunication?: (session: Session) => void;
}

const SessionList: React.FC<SessionListProps> = ({ userType, userId, onOpenCommunication }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    loadSessions();
  }, [userType, userId]);

  useEffect(() => {
    filterSessions();
  }, [sessions, statusFilter, skillFilter]);

  const loadSessions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const sessionData = await sessionAPI.getSessionsByUser(userId);
      setSessions(sessionData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;
    
    if (statusFilter) {
      filtered = filtered.filter(session => session.status === statusFilter);
    }
    
    if (skillFilter) {
      filtered = filtered.filter(session => 
        session.skillName.toLowerCase().includes(skillFilter.toLowerCase())
      );
    }
    
    setFilteredSessions(filtered);
  };

  const handleConfirmSession = async (sessionId: string) => {
    try {
      await sessionAPI.confirmSession(sessionId);
      loadSessions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to confirm session');
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;
    
    try {
      await sessionAPI.cancelSession(sessionId, { reason });
      loadSessions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel session');
    }
  };

  const getStatusColor = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.PENDING: return '#ffc107';
      case SessionStatus.CONFIRMED: return '#28a745';
      case SessionStatus.COMPLETED: return '#6c757d';
      case SessionStatus.CANCELLED: return '#dc3545';
      default: return '#ddd';
    }
  };

  if (loading) return <LoadingMessage>Loading sessions...</LoadingMessage>;

  return (
    <Container>
      <Title>
        {userType === 'teacher' ? 'Teaching Sessions' : 'Learning Sessions'}
      </Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FilterContainer>
        <FilterSelect 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value={SessionStatus.PENDING}>Pending</option>
          <option value={SessionStatus.CONFIRMED}>Confirmed</option>
          <option value={SessionStatus.COMPLETED}>Completed</option>
          <option value={SessionStatus.CANCELLED}>Cancelled</option>
        </FilterSelect>
        
        <Input
          placeholder="Filter by skill..."
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        />
      </FilterContainer>

      {filteredSessions.length === 0 ? (
        <EmptyMessage>
          {sessions.length === 0 
            ? 'No sessions found. Book your first session!' 
            : 'No sessions match your current filters.'
          }
        </EmptyMessage>
      ) : (
        filteredSessions.map(session => (
          <SessionCard key={session.id} color={getStatusColor(session.status)}>
            <SessionHeader>
              <SessionTitle>{session.skillName}</SessionTitle>
              <StatusBadge status={session.status}>{session.status}</StatusBadge>
            </SessionHeader>
            
            <SessionInfo>
              <InfoItem>
                <InfoLabel>Session ID</InfoLabel>
                <InfoValue>{session.id}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Teacher ID</InfoLabel>
                <InfoValue>{session.teacherId}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Learner ID</InfoLabel>
                <InfoValue>{session.learnerId}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Format</InfoLabel>
                <InfoValue>{session.format}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Start Time</InfoLabel>
                <InfoValue>{format(new Date(session.startTime), 'MMM dd, yyyy h:mm a')}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>End Time</InfoLabel>
                <InfoValue>{format(new Date(session.endTime), 'MMM dd, yyyy h:mm a')}</InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>Price</InfoLabel>
                <InfoValue>${session.price}</InfoValue>
              </InfoItem>
            </SessionInfo>
            
            {session.sessionNotes && (
              <InfoItem>
                <InfoLabel>Notes</InfoLabel>
                <InfoValue>{session.sessionNotes}</InfoValue>
              </InfoItem>
            )}
            
            {session.cancellationReason && (
              <InfoItem>
                <InfoLabel>Cancellation Reason</InfoLabel>
                <InfoValue>{session.cancellationReason}</InfoValue>
              </InfoItem>
            )}
            
            <ActionButtons>
              {userType === 'teacher' && session.status === SessionStatus.PENDING && (
                <>
                  <Button 
                    variant="success" 
                    onClick={() => handleConfirmSession(session.id)}
                  >
                    Confirm Session
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleCancelSession(session.id)}
                  >
                    Cancel Session
                  </Button>
                </>
              )}
              
              {session.status === SessionStatus.CONFIRMED && (
                <Button 
                  variant="danger" 
                  onClick={() => handleCancelSession(session.id)}
                >
                  Cancel Session
                </Button>
              )}
              
              {(session.status === SessionStatus.PENDING || session.status === SessionStatus.CONFIRMED) && (
                <Button 
                  variant="info"
                  onClick={() => onOpenCommunication?.(session)}
                >
                  💬 Open Chat
                </Button>
              )}
            </ActionButtons>
          </SessionCard>
        ))
      )}
    </Container>
  );
};

export default SessionList;