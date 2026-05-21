import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SessionStatus } from '../types/session';

const Container = styled.div`
  padding: 0;
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

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
  }
`;

const RequestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RequestCard = styled.div<{ status: SessionStatus }>`
  background: white;
  border: 1px solid #ddd;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#ffc107';
      case SessionStatus.CONFIRMED: return '#28a745';
      case SessionStatus.CANCELLED: return '#dc3545';
      default: return '#6c757d';
    }
  }};
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.h3`
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const SkillName = styled.div`
  color: #007bff;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const RequestTime = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ status: SessionStatus }>`
  background: ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#fff3cd';
      case SessionStatus.CONFIRMED: return '#d4edda';
      case SessionStatus.CANCELLED: return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#856404';
      case SessionStatus.CONFIRMED: return '#155724';
      case SessionStatus.CANCELLED: return '#721c24';
      default: return '#383d41';
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const RequestDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
`;

const DetailItem = styled.div`
  font-size: 0.875rem;
`;

const DetailLabel = styled.div`
  color: #666;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  color: #333;
`;

const LearnerGoals = styled.div`
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  border-left: 4px solid #2196f3;
`;

const GoalsLabel = styled.div`
  font-weight: 500;
  color: #1976d2;
  margin-bottom: 0.5rem;
`;

const GoalsText = styled.div`
  color: #333;
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant: 'accept' | 'decline' | 'reschedule' }>`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'accept':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
        `;
      case 'decline':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      case 'reschedule':
        return `
          background: #ffc107;
          color: #212529;
          &:hover { background: #e0a800; }
        `;
      default:
        return '';
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

interface SessionRequest {
  id: string;
  studentName: string;
  studentId: string;
  skillName: string;
  startTime: string;
  endTime: string;
  format: string;
  price: number;
  learnerGoals?: string;
  preparationNotes?: string;
  status: SessionStatus;
  requestedAt: string;
}

interface IncomingRequestsProps {
  teacherId: string;
}

const IncomingRequests: React.FC<IncomingRequestsProps> = ({ teacherId }) => {
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('pending');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockRequests: SessionRequest[] = [
          {
            id: '1',
            studentName: 'Alex Johnson',
            studentId: 'student-1',
            skillName: 'Guitar Lessons',
            startTime: '2024-01-20T10:00:00',
            endTime: '2024-01-20T11:00:00',
            format: 'IN_PERSON',
            price: 50,
            learnerGoals: 'I want to learn basic chords and strumming patterns. My goal is to play simple songs within 3 months.',
            preparationNotes: 'I have my own guitar but no prior experience.',
            status: SessionStatus.PENDING,
            requestedAt: '2024-01-18T14:30:00'
          },
          {
            id: '2',
            studentName: 'Sarah Wilson',
            studentId: 'student-2',
            skillName: 'Guitar Lessons',
            startTime: '2024-01-22T14:00:00',
            endTime: '2024-01-22T15:00:00',
            format: 'ONLINE',
            price: 50,
            learnerGoals: 'Improve fingerpicking technique and learn intermediate songs.',
            status: SessionStatus.PENDING,
            requestedAt: '2024-01-18T16:45:00'
          },
          {
            id: '3',
            studentName: 'Mike Chen',
            studentId: 'student-3',
            skillName: 'Guitar Lessons',
            startTime: '2024-01-19T09:00:00',
            endTime: '2024-01-19T10:00:00',
            format: 'IN_PERSON',
            price: 50,
            learnerGoals: 'Learn to play classical guitar pieces.',
            status: SessionStatus.CONFIRMED,
            requestedAt: '2024-01-17T10:20:00'
          }
        ];
        setRequests(mockRequests);
        setLoading(false);
      }, 800);
    };
    
    loadRequests();
  }, [teacherId]);

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'pending') return request.status === SessionStatus.PENDING;
    if (filter === 'confirmed') return request.status === SessionStatus.CONFIRMED;
    return true;
  });

  const handleAcceptRequest = (requestId: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status: SessionStatus.CONFIRMED }
          : request
      )
    );
  };

  const handleDeclineRequest = (requestId: string) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status: SessionStatus.CANCELLED }
          : request
      )
    );
  };

  const handleRescheduleRequest = (requestId: string) => {
    // In a real app, this would open a reschedule modal
    alert('Reschedule functionality would open a date/time picker here');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeRange = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div>📬 Loading your session requests...</div>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Session Requests</Title>
        <FilterButtons>
          <FilterButton 
            active={filter === 'pending'} 
            onClick={() => setFilter('pending')}
          >
            Pending ({requests.filter(r => r.status === SessionStatus.PENDING).length})
          </FilterButton>
          <FilterButton 
            active={filter === 'confirmed'} 
            onClick={() => setFilter('confirmed')}
          >
            Confirmed ({requests.filter(r => r.status === SessionStatus.CONFIRMED).length})
          </FilterButton>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All ({requests.length})
          </FilterButton>
        </FilterButtons>
      </Header>

      {filteredRequests.length === 0 ? (
        <EmptyState>
          <div>📭 No session requests found</div>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            {filter === 'pending' ? 'No pending requests at the moment.' : 
             filter === 'confirmed' ? 'No confirmed sessions yet.' : 
             'You haven\'t received any session requests yet.'}
          </div>
        </EmptyState>
      ) : (
        <RequestsList>
          {filteredRequests.map(request => (
            <RequestCard key={request.id} status={request.status}>
              <RequestHeader>
                <StudentInfo>
                  <StudentName>{request.studentName}</StudentName>
                  <SkillName>{request.skillName}</SkillName>
                  <RequestTime>
                    Requested on {formatDateTime(request.requestedAt)}
                  </RequestTime>
                </StudentInfo>
                <StatusBadge status={request.status}>
                  {request.status.replace('_', ' ')}
                </StatusBadge>
              </RequestHeader>

              <RequestDetails>
                <DetailItem>
                  <DetailLabel>📅 Session Date & Time</DetailLabel>
                  <DetailValue>{formatDateTime(request.startTime)}</DetailValue>
                  <DetailValue>{formatTimeRange(request.startTime, request.endTime)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>💻 Format</DetailLabel>
                  <DetailValue>{request.format.replace('_', ' ')}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>💰 Price</DetailLabel>
                  <DetailValue>${request.price}/hour</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>⏱️ Duration</DetailLabel>
                  <DetailValue>1 hour</DetailValue>
                </DetailItem>
              </RequestDetails>

              {request.learnerGoals && (
                <LearnerGoals>
                  <GoalsLabel>🎯 Student's Learning Goals</GoalsLabel>
                  <GoalsText>"{request.learnerGoals}"</GoalsText>
                </LearnerGoals>
              )}

              {request.preparationNotes && (
                <LearnerGoals>
                  <GoalsLabel>📝 Preparation Notes</GoalsLabel>
                  <GoalsText>"{request.preparationNotes}"</GoalsText>
                </LearnerGoals>
              )}

              {request.status === SessionStatus.PENDING && (
                <ActionButtons>
                  <ActionButton 
                    variant="accept" 
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    ✅ Accept Request
                  </ActionButton>
                  <ActionButton 
                    variant="reschedule" 
                    onClick={() => handleRescheduleRequest(request.id)}
                  >
                    📅 Suggest New Time
                  </ActionButton>
                  <ActionButton 
                    variant="decline" 
                    onClick={() => handleDeclineRequest(request.id)}
                  >
                    ❌ Decline
                  </ActionButton>
                </ActionButtons>
              )}

              {request.status === SessionStatus.CONFIRMED && (
                <div style={{ 
                  background: '#d4edda', 
                  color: '#155724', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  ✅ Session confirmed! Check your calendar for details.
                </div>
              )}
            </RequestCard>
          ))}
        </RequestsList>
      )}
    </Container>
  );
};

export default IncomingRequests;