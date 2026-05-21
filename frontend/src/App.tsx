import React, { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import AppRouter from './router/AppRouter';
import { User, UserType } from './types/session';
import { authAPI } from './services/api';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
    color: #333;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth token on app load
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // You can implement a /me endpoint to get current user
          // For now, we'll decode the token or check if it's still valid
          setIsLoading(false);
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('authToken');
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  const handleLogin = (userType: UserType, userData: User) => {
    setUser(userData);
    // Navigation will be handled by router based on user type
  };

  const handleSignUp = (userType: UserType, userData: User) => {
    setUser(userData);
    // Navigation will be handled by router based on user type
  };

  const handleLogout = () => {
    setUser(null);
    // Clear localStorage
    localStorage.removeItem('authToken');
    // Navigate to home will be handled by router
    window.location.href = '/';
  };

  const handleSkillSearch = (skill: string, location: string) => {
    // For now, use window.location since we don't have access to navigate hook here
    // This will be improved when we add proper navigation context
    const searchParams = new URLSearchParams();
    if (skill) searchParams.set('skill', skill);
    if (location) searchParams.set('location', location);
    
    window.location.href = `/search?${searchParams.toString()}`;
  };

  if (isLoading) {
    return (
      <>
        <GlobalStyle />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <AppRouter
        user={user}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onLogout={handleLogout}
        onSkillSearch={handleSkillSearch}
      />
    </>
  );
};

export default App;