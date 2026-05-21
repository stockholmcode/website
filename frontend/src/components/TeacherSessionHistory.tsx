import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SessionStatus, SessionFormat, Session } from '../types/session';

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

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SessionCard = styled.div<{ status: SessionStatus }>`
  background: white;
  border: 1px solid #ddd;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case SessionStatus.COMPLETED: return '#28a745';
      case SessionStatus.CONFIRMED: return '#007bff';
      case SessionStatus.IN_PROGRESS: return '#ffc107';
      case SessionStatus.CANCELLED: return '#dc3545';
      case SessionStatus.NO_SHOW: return '#fd7e14';
      default: return '#6c757d';
    }
  }};
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
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

const SessionTime = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span<{ status: SessionStatus }>`
  background: ${props => {
    switch (props.status) {
      case SessionStatus.COMPLETED: return '#d4edda';
      case SessionStatus.CONFIRMED: return '#cce5ff';
      case SessionStatus.IN_PROGRESS: return '#fff3cd';
      case SessionStatus.CANCELLED: return '#f8d7da';
      case SessionStatus.NO_SHOW: return '#fed7aa';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case SessionStatus.COMPLETED: return '#155724';
      case SessionStatus.CONFIRMED: return '#004085';
      case SessionStatus.IN_PROGRESS: return '#856404';
      case SessionStatus.CANCELLED: return '#721c24';
      case SessionStatus.NO_SHOW: return '#c1440e';
      default: return '#383d41';
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const SessionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

const SessionActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
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
      case 'success':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
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

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Stars = styled.div`
  color: #ffc107;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface TeacherSession {
  id: string;
  studentName: string;
  studentId: string;
  skillName: string;
  startTime: string;
  endTime: string;
  format: SessionFormat;
  price: number;
  status: SessionStatus;
  learnerGoals?: string;
  rating?: number;
  feedback?: string;
  earnings: number;
}

interface TeacherSessionHistoryProps {
  teacherId: string;
  onOpenCommunication?: (session: Session) => void;
}

const TeacherSessionHistory: React.FC<TeacherSessionHistoryProps> = ({ teacherId, onOpenCommunication }) => {
  const [sessions, setSessions] = useState<TeacherSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TeacherSession[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const sessionsPerPage = 5;

  // Mock data - replace with API call
  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockSessions: TeacherSession[] = [
          {
            id: '1',
            studentName: 'Alex Johnson',
            studentId: 'student-1',
            skillName: 'Guitar Lessons',
            startTime: '2024-01-15T10:00:00',
            endTime: '2024-01-15T11:00:00',
            format: SessionFormat.IN_PERSON,
            price: 50,
            status: SessionStatus.COMPLETED,
            learnerGoals: 'Learn basic chords',
            rating: 5,
            feedback: 'Excellent teacher! Very patient and knowledgeable.',
            earnings: 45 // After platform fee
          },
          {
            id: '2',
            studentName: 'Sarah Wilson',
            studentId: 'student-2',
            skillName: 'Guitar Lessons',
            startTime: '2024-01-16T14:00:00',
            endTime: '2024-01-16T15:00:00',
            format: SessionFormat.ONLINE,
            price: 50,
            status: SessionStatus.COMPLETED,
            rating: 4,
            feedback: 'Great session, learned a lot!',
            earnings: 45
          },
          {
            id: '3',
            studentName: 'Mike Chen',
            studentId: 'student-3',
            skillName: 'Guitar Lessons',
            startTime: '2024-01-19T09:00:00',
            endTime: '2024-01-19T10:00:00',
            format: SessionFormat.IN_PERSON,
            price: 50,
            status: SessionStatus.CONFIRMED,
            earnings: 0 // Not paid until completed
          },
          {
            id: '4',
            studentName: 'Emma Davis',
            studentId: 'student-4',
            skillName: 'Guitar Lessons',
            startTime: '2024-01-12T16:00:00',
            endTime: '2024-01-12T17:00:00',
            format: SessionFormat.ONLINE,
            price: 50,
            status: SessionStatus.CANCELLED,
            earnings: 0
          },
          {
            id: '5',
            studentName: 'David Kim',
            studentId: 'student-5',
            skillName: 'Guitar Lessons',
            startTime: '2024-01-10T11:00:00',
            endTime: '2024-01-10T12:00:00',
            format: SessionFormat.IN_PERSON,
            price: 50,
            status: SessionStatus.NO_SHOW,
            earnings: 25 // Partial payment for no-show
          }
        ];
        setSessions(mockSessions);
        setLoading(false);
      }, 800);
    };
    
    loadSessions();
  }, [teacherId]);

  // Filter sessions based on status and search term
  useEffect(() => {
    let filtered = sessions;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.skillName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSessions(filtered);
    setCurrentPage(1);
  }, [sessions, statusFilter, searchTerm]);

  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + sessionsPerPage);

  const completedSessions = sessions.filter(s => s.status === SessionStatus.COMPLETED);
  const totalEarnings = sessions.reduce((sum, session) => sum + session.earnings, 0);
  const averageRating = completedSessions.length > 0 
    ? completedSessions.reduce((sum, session) => sum + (session.rating || 0), 0) / completedSessions.length 
    : 0;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleStartCommunication = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && onOpenCommunication) {
      // Convert TeacherSession to Session format for communication
      const sessionForCommunication = {
        id: session.id,
        teacherId: teacherId,
        learnerId: session.studentId,
        skillName: session.skillName,
        startTime: session.startTime,
        endTime: session.endTime,
        format: session.format,
        price: session.price,
        status: session.status,
        sessionNotes: session.learnerGoals || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onOpenCommunication(sessionForCommunication);
    } else {
      alert(`Starting enhanced session communication for session ${sessionId}`);
    }
  };

  const handleContactStudent = (sessionId: string) => {
    alert(`Contact functionality for session ${sessionId} would open messaging here`);
  };

  const handleRescheduleSession = (sessionId: string) => {
    alert(`Reschedule functionality for session ${sessionId} would open here`);
  };

  const handleViewSession = (sessionId: string) => {
    alert(`View completed session details for session ${sessionId}`);
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div>📚 Loading your session history...</div>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Session History</Title>
        <FilterControls>
          <SearchInput
            type="text"
            placeholder="Search students or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Sessions</option>
            <option value={SessionStatus.COMPLETED}>Completed</option>
            <option value={SessionStatus.CONFIRMED}>Upcoming</option>
            <option value={SessionStatus.CANCELLED}>Cancelled</option>
            <option value={SessionStatus.NO_SHOW}>No Show</option>
          </FilterSelect>
        </FilterControls>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{sessions.length}</StatValue>
          <StatLabel>Total Sessions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{completedSessions.length}</StatValue>
          <StatLabel>Completed Sessions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${totalEarnings}</StatValue>
          <StatLabel>Total Earnings</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{averageRating.toFixed(1)}</StatValue>
          <StatLabel>Average Rating</StatLabel>
        </StatCard>
      </StatsGrid>

      {paginatedSessions.length === 0 ? (
        <EmptyState>
          <div>📭 No sessions found</div>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'You haven\'t taught any sessions yet.'}
          </div>
        </EmptyState>
      ) : (
        <>
          <SessionsList>
            {paginatedSessions.map(session => (
              <SessionCard key={session.id} status={session.status}>
                <SessionHeader>
                  <StudentInfo>
                    <StudentName>{session.studentName}</StudentName>
                    <SkillName>{session.skillName}</SkillName>
                    <SessionTime>{formatDateTime(session.startTime)}</SessionTime>
                    {session.rating && (
                      <RatingDisplay>
                        <Stars>{renderStars(session.rating)}</Stars>
                        <span>({session.rating}/5)</span>
                      </RatingDisplay>
                    )}
                  </StudentInfo>
                  <StatusBadge status={session.status}>
                    {session.status.replace('_', ' ')}
                  </StatusBadge>
                </SessionHeader>

                <SessionDetails>
                  <DetailItem>
                    <DetailLabel>💻 Format</DetailLabel>
                    <DetailValue>{session.format.replace('_', ' ')}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>💰 Price</DetailLabel>
                    <DetailValue>${session.price}/hour</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>💵 Earnings</DetailLabel>
                    <DetailValue>${session.earnings}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>⏱️ Duration</DetailLabel>
                    <DetailValue>1 hour</DetailValue>
                  </DetailItem>
                </SessionDetails>

                {session.learnerGoals && (
                  <div style={{
                    background: '#e3f2fd',
                    padding: '1rem',
                    borderRadius: '6px',
                    margin: '1rem 0',
                    borderLeft: '4px solid #2196f3'
                  }}>
                    <div style={{ fontWeight: '500', color: '#1976d2', marginBottom: '0.5rem' }}>
                      🎯 Student's Goals
                    </div>
                    <div style={{ color: '#333', fontStyle: 'italic' }}>
                      "{session.learnerGoals}"
                    </div>
                  </div>
                )}

                {session.feedback && (
                  <div style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '6px',
                    margin: '1rem 0'
                  }}>
                    <div style={{ fontWeight: '500', color: '#495057', marginBottom: '0.5rem' }}>
                      💬 Student Feedback
                    </div>
                    <div style={{ color: '#333', fontStyle: 'italic' }}>
                      "{session.feedback}"
                    </div>
                  </div>
                )}

                <SessionActions>
                  {(session.status === SessionStatus.CONFIRMED || session.status === SessionStatus.IN_PROGRESS) && (
                    <>
                      <ActionButton 
                        variant="success" 
                        onClick={() => handleStartCommunication(session.id)}
                      >
                        🚀 Start Session
                      </ActionButton>
                      <ActionButton 
                        variant="primary" 
                        onClick={() => handleContactStudent(session.id)}
                      >
                        💬 Message Student
                      </ActionButton>
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => handleRescheduleSession(session.id)}
                      >
                        📅 Reschedule
                      </ActionButton>
                    </>
                  )}
                  {session.status === SessionStatus.COMPLETED && (
                    <>
                      <ActionButton 
                        variant="primary" 
                        onClick={() => handleViewSession(session.id)}
                      >
                        📋 View Session
                      </ActionButton>
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => handleContactStudent(session.id)}
                      >
                        💬 Follow Up
                      </ActionButton>
                    </>
                  )}
                </SessionActions>
              </SessionCard>
            ))}
          </SessionsList>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default TeacherSessionHistory;