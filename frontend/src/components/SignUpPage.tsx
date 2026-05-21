import React, { useState } from 'react';
import styled from 'styled-components';
import { User, UserType } from '../types/session';
import { authAPI } from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const SignUpCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
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

const GoogleSignUpButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }
`;

const GoogleIcon = styled.svg`
  width: 20px;
  height: 20px;
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

const PasswordRequirements = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
  text-align: left;
`;

const Requirement = styled.div<{ met: boolean }>`
  color: ${props => props.met ? '#28a745' : '#666'};
  
  &::before {
    content: '${props => props.met ? '✓' : '•'}';
    margin-right: 0.5rem;
    color: ${props => props.met ? '#28a745' : '#999'};
  }
`;

const SignUpButton = styled.button`
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

const BackToLoginButton = styled.button`
  background: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
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

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const TermsText = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin-top: 1rem;
  line-height: 1.4;
  
  a {
    color: #007bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;


interface SignUpPageProps {
  onSignUp: (userType: UserType, userData: any) => void;
  onBackToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onBackToLogin }) => {
  const [userType, setUserType] = useState<UserType>('learner');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password requirements
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    
    try {
      // For demo purposes, we'll use a mock Google auth request
      // In production, this would integrate with actual Google OAuth
      const mockGoogleRequest = {
        googleToken: 'mock-google-token',
        userType: userType
      };
      
      // Note: The backend has a mock Google auth endpoint at /api/v1/auth/google
      // but for now we'll show a message that Google OAuth needs to be implemented
      setError('Google OAuth integration is not yet implemented. Please use email signup.');
      setLoading(false);
      
    } catch (error: any) {
      setLoading(false);
      setError('An error occurred during Google sign up. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form data
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      // Use real authentication API
      const response = await authAPI.signup(firstName, lastName, email, password, confirmPassword, userType);
      
      if (!response.token || !response.user) {
        setError('Registration failed. Please try again.');
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
      
      setSuccess('Account created successfully! Signing you in...');
      
      // Call onSignUp with the created user
      setTimeout(() => {
        onSignUp(userType, user);
        setLoading(false);
      }, 1000);
      
    } catch (error: any) {
      setLoading(false);
      console.error('Signup error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message === 'User with this email already exists') {
        setError('An account with this email already exists. Please use a different email or try signing in.');
      } else {
        setError('An error occurred while creating your account. Please try again.');
      }
    }
  };

  return (
    <Container>
      <SignUpCard>
        <Logo>CLE</Logo>
        <Tagline>Join the Community Learning Exchange</Tagline>
        
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

        <GoogleSignUpButton onClick={handleGoogleSignUp} disabled={loading}>
          <GoogleIcon viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </GoogleIcon>
          {loading ? 'Connecting to Google...' : 'Continue with Google'}
        </GoogleSignUpButton>

        <Divider>or</Divider>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </InputGroup>
          </div>

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
              placeholder="Create a password"
              required
            />
            {password && (
              <PasswordRequirements>
                <Requirement met={passwordRequirements.length}>At least 8 characters</Requirement>
                <Requirement met={passwordRequirements.uppercase}>One uppercase letter</Requirement>
                <Requirement met={passwordRequirements.lowercase}>One lowercase letter</Requirement>
                <Requirement met={passwordRequirements.number}>One number</Requirement>
              </PasswordRequirements>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            {confirmPassword && (
              <PasswordRequirements>
                <Requirement met={passwordsMatch}>Passwords match</Requirement>
              </PasswordRequirements>
            )}
          </InputGroup>

          <SignUpButton 
            type="submit" 
            disabled={loading || !isPasswordValid || !passwordsMatch}
          >
            {loading ? 'Creating account...' : `Create ${userType === 'teacher' ? 'Teacher' : 'Learner'} Account`}
          </SignUpButton>
        </Form>

        <TermsText>
          By creating an account, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
        </TermsText>

        <BackToLoginButton onClick={onBackToLogin}>
          Already have an account? Sign in
        </BackToLoginButton>
      </SignUpCard>
    </Container>
  );
};

export default SignUpPage;