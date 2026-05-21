import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { SessionPlan, SessionPlanRequest } from '../types/message';
import { sessionPlanAPI } from '../services/messageApi';

const FormContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
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
      default:
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
    }
  }}
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
`;

const CompletedBadge = styled.span`
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #007bff;
`;

interface SessionPlanFormProps {
  sessionId: string;
  userId: string;
  onPlanUpdated?: (plan: SessionPlan) => void;
}

const SessionPlanForm: React.FC<SessionPlanFormProps> = ({ 
  sessionId, 
  userId, 
  onPlanUpdated 
}) => {
  const [sessionPlan, setSessionPlan] = useState<SessionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<SessionPlanRequest>();

  useEffect(() => {
    loadSessionPlan();
  }, [sessionId, userId]);

  const loadSessionPlan = async () => {
    setLoading(true);
    setError('');
    
    try {
      const plan = await sessionPlanAPI.getSessionPlan(userId, sessionId);
      setSessionPlan(plan);
      
      if (plan) {
        // Populate form with existing data
        setValue('sessionId', plan.sessionId);
        setValue('learningObjectives', plan.learningObjectives || '');
        setValue('materialsNeeded', plan.materialsNeeded || '');
        setValue('locationDetails', plan.locationDetails || '');
        setValue('emergencyContact', plan.emergencyContact || '');
        setValue('specialInstructions', plan.specialInstructions || '');
      } else {
        setValue('sessionId', sessionId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load session plan');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SessionPlanRequest) => {
    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const updatedPlan = await sessionPlanAPI.createOrUpdateSessionPlan(userId, data);
      setSessionPlan(updatedPlan);
      setSuccessMessage('Session plan saved successfully!');
      onPlanUpdated?.(updatedPlan);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save session plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!sessionPlan) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      const completedPlan = await sessionPlanAPI.markSessionPlanCompleted(userId, sessionId);
      setSessionPlan(completedPlan);
      setSuccessMessage('Session plan marked as completed!');
      onPlanUpdated?.(completedPlan);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark session plan as completed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!sessionPlan || !window.confirm('Are you sure you want to delete this session plan?')) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await sessionPlanAPI.deleteSessionPlan(userId, sessionId);
      setSessionPlan(null);
      reset();
      setSuccessMessage('Session plan deleted successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete session plan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading session plan...</div>;

  return (
    <FormContainer>
      <Title>
        Session Planning
        {sessionPlan?.isCompleted && <CompletedBadge>Completed</CompletedBadge>}
      </Title>
      
      <InfoSection>
        <strong>Pre-Session Planning</strong>
        <p>Use this form to coordinate session details with your learning partner. Share objectives, required materials, location information, and emergency contacts.</p>
      </InfoSection>
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="learningObjectives">Learning Objectives</Label>
          <TextArea
            id="learningObjectives"
            placeholder="What do you hope to achieve in this session?"
            {...register('learningObjectives', {
              maxLength: { value: 500, message: 'Learning objectives cannot exceed 500 characters' }
            })}
          />
          {errors.learningObjectives && <ErrorMessage>{errors.learningObjectives.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="materialsNeeded">Materials & Equipment Needed</Label>
          <TextArea
            id="materialsNeeded"
            placeholder="List any materials, tools, or equipment needed for the session..."
            {...register('materialsNeeded', {
              maxLength: { value: 1000, message: 'Materials list cannot exceed 1000 characters' }
            })}
          />
          {errors.materialsNeeded && <ErrorMessage>{errors.materialsNeeded.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="locationDetails">Location Details</Label>
          <TextArea
            id="locationDetails"
            placeholder="Specific location details, directions, parking info, etc."
            {...register('locationDetails', {
              maxLength: { value: 500, message: 'Location details cannot exceed 500 characters' }
            })}
          />
          {errors.locationDetails && <ErrorMessage>{errors.locationDetails.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            type="text"
            placeholder="Emergency contact name and phone number"
            {...register('emergencyContact', {
              maxLength: { value: 200, message: 'Emergency contact cannot exceed 200 characters' }
            })}
          />
          {errors.emergencyContact && <ErrorMessage>{errors.emergencyContact.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="specialInstructions">Special Instructions</Label>
          <TextArea
            id="specialInstructions"
            placeholder="Any special instructions or notes for the session..."
            {...register('specialInstructions', {
              maxLength: { value: 1000, message: 'Special instructions cannot exceed 1000 characters' }
            })}
          />
          {errors.specialInstructions && <ErrorMessage>{errors.specialInstructions.message}</ErrorMessage>}
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Plan'}
          </Button>
          
          {sessionPlan && !sessionPlan.isCompleted && (
            <Button 
              type="button" 
              variant="success" 
              onClick={handleMarkCompleted}
              disabled={submitting}
            >
              Mark Completed
            </Button>
          )}
          
          {sessionPlan && (
            <Button 
              type="button" 
              variant="danger" 
              onClick={handleDelete}
              disabled={submitting}
            >
              Delete Plan
            </Button>
          )}
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default SessionPlanForm;