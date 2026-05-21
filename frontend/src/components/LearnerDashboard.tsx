import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Session, SessionStatus, SessionFormat } from '../types/session';
import { sessionAPI } from '../services/api';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
`;

const WelcomeSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #ddd;
  margin-bottom: 2rem;
  background: white;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.active ? '#28a745' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid ${props => props.active ? '#28a745' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? '#218838' : '#f8f9fa'};
    color: ${props => props.active ? 'white' : '#333'};
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 500px;
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
      case SessionStatus.PENDING: return '#6c757d';
      case SessionStatus.CANCELLED: return '#dc3545';
      default: return '#6c757d';
    }
  }};
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TeacherInfo = styled.div`
  flex: 1;
`;

const TeacherName = styled.h3`
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const SkillName = styled.div`
  color: #28a745;
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
      case SessionStatus.PENDING: return '#e2e3e5';
      case SessionStatus.CANCELLED: return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case SessionStatus.COMPLETED: return '#155724';
      case SessionStatus.CONFIRMED: return '#004085';
      case SessionStatus.IN_PROGRESS: return '#856404';
      case SessionStatus.PENDING: return '#383d41';
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
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
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

interface LearnerDashboardProps {
  learnerId: string;
  learnerName?: string;
  onOpenCommunication?: (session: Session) => void;
}

type TabType = 'upcoming' | 'history' | 'all';

const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ 
  learnerId, 
  learnerName = 'Learner',
  onOpenCommunication 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load sessions from backend API
  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const userSessions = await sessionAPI.getSessionsByUser(learnerId);
        
        // If no sessions from backend, show sample data for demo
        if (userSessions.length === 0) {
          const mockSessions: Session[] = [
            {
              id: '1',
              teacherId: '00000000-0000-0000-0000-000000000001',
              learnerId: learnerId,
              skillName: 'Guitar Lessons',
              startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
              format: SessionFormat.IN_PERSON,
              price: 50,
              status: SessionStatus.CONFIRMED,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '2',
              teacherId: '00000000-0000-0000-0000-000000000002',
              learnerId: learnerId,
              skillName: 'Python Programming',
              startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
              format: SessionFormat.ONLINE,
              price: 75,
              status: SessionStatus.CONFIRMED,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: '3',
              teacherId: '00000000-0000-0000-0000-000000000003',
              learnerId: learnerId,
              skillName: 'Spanish Conversation',
              startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
              format: SessionFormat.ONLINE,
              price: 45,
              status: SessionStatus.COMPLETED,
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '4',
              teacherId: '00000000-0000-0000-0000-000000000004',
              learnerId: learnerId,
              skillName: 'Yoga for Beginners',
              startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000).toISOString(),
              format: SessionFormat.IN_PERSON,
              price: 40,
              status: SessionStatus.PENDING,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          setSessions(mockSessions);
        } else {
          setSessions(userSessions);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
        // Show sample data even if API fails
        const mockSessions: Session[] = [
          {
            id: '1',
            teacherId: '00000000-0000-0000-0000-000000000001',
            learnerId: learnerId,
            skillName: 'Guitar Lessons',
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            format: SessionFormat.IN_PERSON,
            price: 50,
            status: SessionStatus.CONFIRMED,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            teacherId: '00000000-0000-0000-0000-000000000002',
            learnerId: learnerId,
            skillName: 'Python Programming',
            startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
            format: SessionFormat.ONLINE,
            price: 75,
            status: SessionStatus.CONFIRMED,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setSessions(mockSessions);
      } finally {
        setLoading(false);
      }
    };
    
    loadSessions();
  }, [learnerId]);

  // Filter sessions based on tab and filters
  useEffect(() => {
    let filtered = sessions;
    
    // Filter by tab
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(session => 
        session.status === SessionStatus.CONFIRMED || 
        session.status === SessionStatus.PENDING ||
        session.status === SessionStatus.IN_PROGRESS
      );
    } else if (activeTab === 'history') {
      filtered = filtered.filter(session => 
        session.status === SessionStatus.COMPLETED || 
        session.status === SessionStatus.CANCELLED
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.skillName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSessions(filtered);
  }, [sessions, activeTab, statusFilter, searchTerm]);

  const upcomingSessions = sessions.filter(s => 
    s.status === SessionStatus.CONFIRMED || 
    s.status === SessionStatus.PENDING ||
    s.status === SessionStatus.IN_PROGRESS
  );
  
  const completedSessions = sessions.filter(s => s.status === SessionStatus.COMPLETED);
  const totalSpent = completedSessions.reduce((sum, session) => sum + session.price, 0);

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

  const handleJoinSession = (session: Session) => {
    if (onOpenCommunication) {
      onOpenCommunication(session);
    } else {
      alert(`Joining session: ${session.skillName}`);
    }
  };

  const handleCancelSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: SessionStatus.CANCELLED }
          : session
      ));
    }
  };

  const handleRescheduleSession = (sessionId: string) => {
    alert(`Reschedule functionality for session ${sessionId} would open here`);
  };

  const handleRateSession = (sessionId: string) => {
    alert(`Rating functionality for session ${sessionId} would open here`);
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          📚 Loading your sessions...
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <WelcomeBanner>
        <WelcomeTitle>Welcome back, {learnerName}!</WelcomeTitle>
        <WelcomeSubtitle>Track your learning journey and manage your sessions</WelcomeSubtitle>
      </WelcomeBanner>

      <StatsGrid>
        <StatCard>
          <StatValue>{sessions.length}</StatValue>
          <StatLabel>Total Sessions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{upcomingSessions.length}</StatValue>
          <StatLabel>Upcoming Sessions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{completedSessions.length}</StatValue>
          <StatLabel>Completed Sessions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${totalSpent}</StatValue>
          <StatLabel>Total Investment</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabContainer>
        <Tab 
          active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          📅 Upcoming Sessions
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          📖 Session History
        </Tab>
        <Tab 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          📋 All Sessions
        </Tab>
      </TabContainer>

      <ContentArea>
        <FilterControls>
          <SearchInput
            type="text"
            placeholder="Search by skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value={SessionStatus.PENDING}>Pending</option>
            <option value={SessionStatus.CONFIRMED}>Confirmed</option>
            <option value={SessionStatus.IN_PROGRESS}>In Progress</option>
            <option value={SessionStatus.COMPLETED}>Completed</option>
            <option value={SessionStatus.CANCELLED}>Cancelled</option>
          </FilterSelect>
        </FilterControls>

        {filteredSessions.length === 0 ? (
          <EmptyState>
            <div>📭 No sessions found</div>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
              {activeTab === 'upcoming' 
                ? 'You don\'t have any upcoming sessions. Find a teacher to book your next learning session!' 
                : 'No sessions match your current filter criteria.'}
            </div>
          </EmptyState>
        ) : (
          <SessionsList>
            {filteredSessions.map(session => (
              <SessionCard key={session.id} status={session.status}>
                <SessionHeader>
                  <TeacherInfo>
                    <TeacherName>Teacher ID: {session.teacherId}</TeacherName>
                    <SkillName>{session.skillName}</SkillName>
                    <SessionTime>{formatDateTime(session.startTime)}</SessionTime>
                  </TeacherInfo>
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
                    <DetailLabel>⏱️ Duration</DetailLabel>
                    <DetailValue>1 hour</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>📅 Booked</DetailLabel>
                    <DetailValue>{new Date(session.createdAt).toLocaleDateString()}</DetailValue>
                  </DetailItem>
                </SessionDetails>

                <SessionActions>
                  {session.status === SessionStatus.CONFIRMED && (
                    <>
                      <ActionButton 
                        variant="success" 
                        onClick={() => handleJoinSession(session)}
                      >
                        🚀 Join Session
                      </ActionButton>
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => handleRescheduleSession(session.id)}
                      >
                        📅 Reschedule
                      </ActionButton>
                      <ActionButton 
                        variant="danger" 
                        onClick={() => handleCancelSession(session.id)}
                      >
                        ❌ Cancel
                      </ActionButton>
                    </>
                  )}
                  {session.status === SessionStatus.IN_PROGRESS && (
                    <ActionButton 
                      variant="success" 
                      onClick={() => handleJoinSession(session)}
                    >
                      🔥 Continue Session
                    </ActionButton>
                  )}
                  {session.status === SessionStatus.PENDING && (
                    <>
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => handleRescheduleSession(session.id)}
                      >
                        📅 Reschedule
                      </ActionButton>
                      <ActionButton 
                        variant="danger" 
                        onClick={() => handleCancelSession(session.id)}
                      >
                        ❌ Cancel
                      </ActionButton>
                    </>
                  )}
                  {session.status === SessionStatus.COMPLETED && (
                    <ActionButton 
                      variant="primary" 
                      onClick={() => handleRateSession(session.id)}
                    >
                      ⭐ Rate & Review
                    </ActionButton>
                  )}
                </SessionActions>
              </SessionCard>
            ))}
          </SessionsList>
        )}
      </ContentArea>
    </DashboardContainer>
  );
};

export default LearnerDashboard;