import React, { useState } from 'react';
import styled from 'styled-components';
import IncomingRequests from './IncomingRequests';
import TeacherSessionHistory from './TeacherSessionHistory';
import TeacherEarnings from './TeacherEarnings';
import CourseManagement from './CourseManagement';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
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
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid ${props => props.active ? '#007bff' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
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

const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
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

interface TeacherDashboardProps {
  teacherId: string;
  teacherName?: string;
  onOpenCommunication?: (session: any) => void;
}

type TabType = 'courses' | 'requests' | 'history' | 'earnings';

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacherId, teacherName = 'Teacher', onOpenCommunication }) => {
  const [activeTab, setActiveTab] = useState<TabType>('courses');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return <CourseManagement teacherId={teacherId} />;
      case 'requests':
        return <IncomingRequests teacherId={teacherId} />;
      case 'history':
        return <TeacherSessionHistory teacherId={teacherId} onOpenCommunication={onOpenCommunication} />;
      case 'earnings':
        return <TeacherEarnings teacherId={teacherId} />;
      default:
        return <CourseManagement teacherId={teacherId} />;
    }
  };

  return (
    <DashboardContainer>
      <WelcomeBanner>
        <WelcomeTitle>Welcome back, {teacherName}!</WelcomeTitle>
        <WelcomeSubtitle>Manage your teaching schedule and sessions</WelcomeSubtitle>
      </WelcomeBanner>

      <TabContainer>
        <Tab 
          active={activeTab === 'courses'} 
          onClick={() => setActiveTab('courses')}
        >
          📖 Courses
        </Tab>
        <Tab 
          active={activeTab === 'requests'} 
          onClick={() => setActiveTab('requests')}
        >
          📬 Requests
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          📚 Session History
        </Tab>
        <Tab 
          active={activeTab === 'earnings'} 
          onClick={() => setActiveTab('earnings')}
        >
          💰 Earnings
        </Tab>
      </TabContainer>

      <ContentArea>
        {renderTabContent()}
      </ContentArea>
    </DashboardContainer>
  );
};

export default TeacherDashboard;