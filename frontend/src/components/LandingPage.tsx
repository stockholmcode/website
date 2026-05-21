import React, { useState } from 'react';
import styled from 'styled-components';
import { SessionFormat, AVAILABLE_SKILLS } from '../types/session';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const LoginButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const LoginButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid white'};
  border-radius: 6px;
  background: ${props => props.variant === 'primary' ? 'white' : 'transparent'};
  color: ${props => props.variant === 'primary' ? '#333' : 'white'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#f8f9fa' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-1px);
  }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem 3rem;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SearchSection = styled.section`
  background: white;
  margin: 0 2rem;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-2rem);
`;

const SearchTitle = styled.h2`
  text-align: center;
  color: #333;
  margin: 0 0 2rem 0;
  font-size: 1.8rem;
`;

const SearchForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Input = styled.input`
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const SearchButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 2rem;
  background: white;
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
`;

const FeatureDescription = styled.p`
  color: #666;
  margin: 0;
  line-height: 1.6;
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
`;

const CTASubtitle = styled.p`
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CTAButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid white'};
  border-radius: 8px;
  background: ${props => props.variant === 'primary' ? 'white' : 'transparent'};
  color: ${props => props.variant === 'primary' ? '#333' : 'white'};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#f8f9fa' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

interface LandingPageProps {
  onLogin: () => void;
  onSignUp?: () => void;
  onSkillSearch: (skill: string, location: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignUp, onSkillSearch }) => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (selectedSkill) {
      onSkillSearch(selectedSkill, location);
    }
  };

  const skillsByCategory = AVAILABLE_SKILLS.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_SKILLS>);

  return (
    <Container>
      <Header>
        <Logo>CLE</Logo>
        <LoginButtons>
          <LoginButton variant="secondary" onClick={onLogin}>
            Sign In
          </LoginButton>
          <LoginButton variant="primary" onClick={onSignUp || onLogin}>
            Get Started
          </LoginButton>
        </LoginButtons>
      </Header>

      <HeroSection>
        <HeroTitle>Learn Anything, Anywhere</HeroTitle>
        <HeroSubtitle>
          Connect with expert instructors for personalized learning in music, languages, technology, and more
        </HeroSubtitle>
      </HeroSection>

      <SearchSection>
        <SearchTitle>Find Your Perfect Teacher</SearchTitle>
        <SearchForm>
          <InputGroup>
            <Label htmlFor="skill">Subject</Label>
            <Select
              id="skill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">Select a skill to learn...</option>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <optgroup key={category} label={category}>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city or zip code"
            />
          </InputGroup>

          <SearchButton onClick={handleSearch}>
            Search Teachers
          </SearchButton>
        </SearchForm>
      </SearchSection>

      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Personalized Learning</FeatureTitle>
            <FeatureDescription>
              Find teachers who match your learning style, schedule, and goals for a truly personalized experience.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>💫</FeatureIcon>
            <FeatureTitle>Expert Instructors</FeatureTitle>
            <FeatureDescription>
              Connect with verified, experienced teachers who are passionate about sharing their knowledge.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🌐</FeatureIcon>
            <FeatureTitle>Flexible Sessions</FeatureTitle>
            <FeatureDescription>
              Choose from in-person, online, or hybrid sessions that fit your schedule and preferences.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <CTASection>
        <CTATitle>Ready to Start Learning?</CTATitle>
        <CTASubtitle>
          Join thousands of learners and teachers in our community
        </CTASubtitle>
        <CTAButtons>
          <CTAButton variant="primary" onClick={onSignUp || onLogin}>
            Sign Up as a Learner
          </CTAButton>
          <CTAButton variant="secondary" onClick={onSignUp || onLogin}>
            Become a Teacher
          </CTAButton>
        </CTAButtons>
      </CTASection>
    </Container>
  );
};

export default LandingPage;