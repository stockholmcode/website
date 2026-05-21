import React, { useState } from 'react';
import styled from 'styled-components';
import { authAPI } from '../services/api';
import { User, UserType } from '../types/session';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.h1`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
`;

const Tagline = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const UserTypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const UserTypeButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${props => props.active ? '#007bff' : '#e9ecef'};
  border-radius: 8px;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #007bff;
    color: ${props => props.active ? 'white' : '#007bff'};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const LoginButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #999;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e9ecef;
  }
  
  &::before {
    margin-right: 1rem;
  }
  
  &::after {
    margin-left: 1rem;
  }
`;

const BackToHomeButton = styled.button`
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SignUpLink = styled.p`
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface LoginPageProps {
  onLogin: (userType: UserType, userData: User) => void;
  onBackToHome: () => void;
  onGoToSignUp?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToHome, onGoToSignUp }) => {
  const [userType, setUserType] = useState<UserType>('learner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Use real authentication API
      const response = await authAPI.login(email, password, userType);
      
      if (!response.token || !response.user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      
      // Store the JWT token
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      // Convert backend user format to frontend User type
      const user: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        userType: response.user.userType.toLowerCase() as UserType,
        profilePicture: response.user.profilePicture || undefined,
        authProvider: response.user.authProvider,
        isVerified: response.user.isVerified,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
      };
      
      // Successfully authenticated
      onLogin(userType, user);
      setLoading(false);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Logo>CLE</Logo>
        <Tagline>Community Learning Exchange</Tagline>
        
        <UserTypeSelector>
          <UserTypeButton
            type="button"
            active={userType === 'learner'}
            onClick={() => setUserType('learner')}
          >
            👨‍🎓 I want to learn
          </UserTypeButton>
          <UserTypeButton
            type="button"
            active={userType === 'teacher'}
            onClick={() => setUserType('teacher')}
          >
            👨‍🏫 I want to teach
          </UserTypeButton>
        </UserTypeSelector>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </InputGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Signing in...' : `Sign in as ${userType === 'teacher' ? 'Teacher' : 'Learner'}`}
          </LoginButton>
        </Form>

        <SignUpLink>
          Don't have an account? <a href="#signup" onClick={(e) => { e.preventDefault(); onGoToSignUp?.(); }}>Sign up here</a>
        </SignUpLink>

        <Divider>or</Divider>

        <BackToHomeButton onClick={onBackToHome}>
          Continue without signing in
        </BackToHomeButton>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;