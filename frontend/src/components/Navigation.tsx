import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  background: #343a40;
  padding: 1rem 0;
  margin-bottom: 2rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? '#007bff' : 'transparent'};
  color: white;
  border: 1px solid ${props => props.active ? '#007bff' : 'transparent'};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #007bff;
    border-color: #007bff;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  font-size: 0.875rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const UserType = styled.span`
  opacity: 0.8;
  font-size: 0.75rem;
`;

const LogoutButton = styled.button`
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

interface User {
  id: string;
  email: string;
  name: string;
  userType: 'teacher' | 'learner';
}

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userType: 'teacher' | 'learner' | null;
  userId: string;
  user?: User | null;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onViewChange, 
  userType, 
  userId,
  user,
  onLogout
}) => {
  // Don't show navigation if no user (landing/login pages)
  if (!user && !userType) {
    return null;
  }

  return (
    <Nav>
      <NavContainer>
        <Logo>CLE</Logo>
        
        <NavLinks>
          {userType === 'learner' ? (
            <>
              <NavLink 
                active={currentView === 'search'} 
                onClick={() => onViewChange('search')}
              >
                🔍 Find Teachers
              </NavLink>
              <NavLink 
                active={currentView === 'sessions'} 
                onClick={() => onViewChange('sessions')}
              >
                📚 My Sessions
              </NavLink>
            </>
          ) : userType === 'teacher' ? (
            <>
              <NavLink 
                active={currentView === 'dashboard'} 
                onClick={() => onViewChange('dashboard')}
              >
                📊 Dashboard
              </NavLink>
              <NavLink 
                active={currentView === 'search'} 
                onClick={() => onViewChange('search')}
              >
                👥 Browse Platform
              </NavLink>
            </>
          ) : null}
        </NavLinks>
        
        {user && (
          <UserInfo>
            <UserDetails>
              <UserName>{user.name}</UserName>
              <UserType>{user.userType === 'teacher' ? 'Teacher' : 'Learner'}</UserType>
            </UserDetails>
            {onLogout && (
              <LogoutButton onClick={onLogout}>
                Sign Out
              </LogoutButton>
            )}
          </UserInfo>
        )}
      </NavContainer>
    </Nav>
  );
};

export default Navigation;