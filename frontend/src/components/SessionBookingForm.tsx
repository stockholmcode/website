import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { SessionBookingRequest, SessionFormat } from '../types/session';
import { sessionAPI } from '../services/api';
import AvailabilityCalendar from './AvailabilityCalendar';
import BookingConfirmationModal from './BookingConfirmationModal';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0056b3;
  }
  
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

interface SessionBookingFormProps {
  onSessionBooked?: (session: any) => void;
  selectedTeacher?: string | null;
  currentUserId?: string;
  selectedTeacherData?: {
    id: string;
    name: string;
    skill: string;
    price: number;
    availabilities?: Array<{
      id: string;
      date: string;
      startTime: string;
      endTime: string;
      maxStudents: number;
      location?: string;
      virtualMeetingUrl?: string;
      isActive: boolean;
    }>;
  } | null;
}

const SessionBookingForm: React.FC<SessionBookingFormProps> = ({ onSessionBooked, selectedTeacher, currentUserId, selectedTeacherData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ date: string; time: string } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<SessionBookingRequest | null>(null);
  
  // Use provided user ID or fallback to default
  const userId = currentUserId || '00000000-0000-0000-0000-000000000001'; // Mock learner ID
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<SessionBookingRequest>({
    defaultValues: {
      teacherId: selectedTeacher || '',
      learnerId: userId,
      skillName: selectedTeacherData?.skill || ''
    }
  });

  const watchedStartTime = watch('startTime');
  const watchedTeacherId = watch('teacherId');

  const handleTimeSlotSelect = (date: string, time: string) => {
    setSelectedTimeSlot({ date, time });
    // Create a proper datetime string in local timezone, then convert to UTC
    const localDateTime = `${date}T${time}:00`;
    const localDate = new Date(localDateTime);
    const utcDateTime = localDate.toISOString();
    
    console.log('📅 Selected time slot:', { date, time, utcDateTime });
    
    setValue('startTime', utcDateTime);
    setShowCalendar(false);
  };


  const onSubmit = async (data: SessionBookingRequest) => {
    // Ensure we have a valid start time
    if (!data.startTime || !selectedTimeSlot) {
      setError('Please select a start time from the calendar');
      return;
    }
    
    // Validate that the selected time slot exists in teacher's availability
    const selectedAvailability = selectedTeacherData?.availabilities?.find(avail => 
      avail.date === selectedTimeSlot.date && 
      avail.startTime.substring(0, 5) === selectedTimeSlot.time &&
      avail.isActive
    );
    
    if (!selectedAvailability) {
      setError('Selected time slot is no longer available. Please choose another time.');
      return;
    }
    
    // Use the exact start and end times from the teacher's availability
    const startTime = new Date(data.startTime);
    
    // Validate start time is valid
    if (isNaN(startTime.getTime())) {
      setError('Invalid start time selected');
      return;
    }
    
    // Calculate end time based on teacher's availability duration
    const availabilityStart = new Date(`${selectedTimeSlot.date}T${selectedAvailability.startTime}`);
    const availabilityEnd = new Date(`${selectedTimeSlot.date}T${selectedAvailability.endTime}`);
    const duration = availabilityEnd.getTime() - availabilityStart.getTime();
    const endTime = new Date(startTime.getTime() + duration);
    
    // Format times in ISO format
    const startTimeISO = startTime.toISOString();
    const endTimeISO = endTime.toISOString();
    
    console.log('✅ Availability validated:', { selectedTimeSlot, startTimeISO, endTimeISO });
    
    // Determine session format based on availability
    const hasVirtualUrl = selectedAvailability.virtualMeetingUrl && selectedAvailability.virtualMeetingUrl.trim() !== '';
    const hasLocation = selectedAvailability.location && selectedAvailability.location.trim() !== '';
    
    let sessionFormat = SessionFormat.ONLINE;
    if (hasLocation && hasVirtualUrl) {
      sessionFormat = SessionFormat.HYBRID;
    } else if (hasLocation && !hasVirtualUrl) {
      sessionFormat = SessionFormat.IN_PERSON;
    }
    
    // Ensure IDs are set (hidden from user but required for booking)
    const processedData = {
      ...data,
      teacherId: selectedTeacher || selectedTeacherData?.id || data.teacherId,
      learnerId: userId,
      startTime: startTimeISO,
      endTime: endTimeISO,
      format: sessionFormat,
      price: selectedTeacherData?.price || 50,
      // Use teacher's actual location/meeting info
      virtualMeetingUrl: selectedAvailability.virtualMeetingUrl || '',
      location: selectedAvailability.location || '',
    };
    
    console.log('📋 Booking data prepared:', processedData);
    
    setPendingBookingData(processedData);
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    if (!pendingBookingData) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    
    console.log('🔄 Submitting booking request...');
    
    try {
      const session = await sessionAPI.bookSession(pendingBookingData);
      setSuccessMessage(`Session booked successfully! Session ID: ${session.id}`);
      setShowConfirmModal(false);
      reset();
      setSelectedTimeSlot(null);
      onSessionBooked?.(session);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <Title>Book a Learning Session</Title>
      
      {selectedTeacher && (
        <div style={{
          background: '#e3f2fd',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #2196f3'
        }}>
          <strong>📍 Teacher Selected</strong>
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
            You're booking with a teacher from your search results
          </div>
        </div>
      )}
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Teacher and Learner IDs are handled internally - not shown to user */}
        <input type="hidden" {...register('teacherId')} />
        <input type="hidden" {...register('learnerId')} />

        <FormGroup>
          <Label htmlFor="skillName">Skill Name</Label>
          {selectedTeacherData ? (
            <div style={{
              padding: '0.75rem',
              border: '1px solid #28a745',
              borderRadius: '4px',
              background: '#f8f9fa',
              color: '#333',
              fontSize: '1rem'
            }}>
              {selectedTeacherData.skill}
            </div>
          ) : (
            <Input
              id="skillName"
              type="text"
              {...register('skillName', { 
                required: 'Skill name is required',
                minLength: { value: 2, message: 'Skill name must be at least 2 characters' }
              })}
            />
          )}
          {/* Hidden input to maintain form data */}
          <input 
            type="hidden" 
            {...register('skillName')} 
            value={selectedTeacherData?.skill || ''}
          />
          {errors.skillName && <ErrorMessage>{errors.skillName.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startTime">Choose day and time</Label>
          {selectedTimeSlot ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #28a745',
                borderRadius: '4px',
                background: '#f8f9fa',
                color: '#333',
                fontSize: '1rem'
              }}>
                {new Date(selectedTimeSlot.date).toLocaleDateString()} at {selectedTimeSlot.time}
              </div>
              <Button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                style={{ width: 'auto', padding: '0.75rem 1rem', background: '#28a745' }}
              >
                📅 Change
              </Button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px dashed #007bff',
                borderRadius: '4px',
                background: '#f8f9fa',
                color: '#666',
                fontSize: '1rem',
                textAlign: 'center'
              }}>
                Please select a time slot from the calendar
              </div>
              <Button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                style={{ width: 'auto', padding: '0.75rem 1rem' }}
              >
                📅 Select
              </Button>
            </div>
          )}
          {/* Hidden input to maintain form data */}
          <input 
            type="hidden" 
            {...register('startTime', { required: 'Start time is required' })}
          />
          {errors.startTime && <ErrorMessage>{errors.startTime.message}</ErrorMessage>}
        </FormGroup>

        {showCalendar && (selectedTeacher || watchedTeacherId) && (
          <FormGroup>
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>Available Time Slots</h4>
              <AvailabilityCalendar
                teacherId={selectedTeacher || watchedTeacherId || ''}
                onTimeSlotSelect={handleTimeSlotSelect}
                selectedSlot={selectedTimeSlot}
                availabilities={selectedTeacherData?.availabilities || []}
              />
            </div>
          </FormGroup>
        )}







        <FormGroup>
          <Label htmlFor="learnerGoals">Learner Goals (optional)</Label>
          <Input
            id="learnerGoals"
            type="text"
            {...register('learnerGoals')}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="preparationNotes">Preparation Notes (optional)</Label>
          <Input
            id="preparationNotes"
            type="text"
            {...register('preparationNotes')}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            {...register('cardNumber', { 
              required: 'Card number is required',
              pattern: {
                value: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/,
                message: 'Please enter a valid card number'
              }
            })}
          />
          {errors.cardNumber && <ErrorMessage>{errors.cardNumber.message}</ErrorMessage>}
        </FormGroup>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              {...register('expiryDate', { 
                required: 'Expiry date is required',
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: 'Please enter MM/YY format'
                }
              })}
            />
            {errors.expiryDate && <ErrorMessage>{errors.expiryDate.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup style={{ flex: 1 }}>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              type="text"
              placeholder="123"
              {...register('cvv', { 
                required: 'CVV is required',
                pattern: {
                  value: /^\d{3,4}$/,
                  message: 'Please enter a valid CVV'
                }
              })}
            />
            {errors.cvv && <ErrorMessage>{errors.cvv.message}</ErrorMessage>}
          </FormGroup>
        </div>

        <FormGroup>
          <Label htmlFor="billingName">Cardholder Name</Label>
          <Input
            id="billingName"
            type="text"
            placeholder="John Doe"
            {...register('billingName', { 
              required: 'Cardholder name is required'
            })}
          />
          {errors.billingName && <ErrorMessage>{errors.billingName.message}</ErrorMessage>}
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit" disabled={isSubmitting}>
          Review Booking
        </Button>
      </form>

      <BookingConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmBooking}
        bookingData={pendingBookingData || {} as SessionBookingRequest}
        isSubmitting={isSubmitting}
      />
    </FormContainer>
  );
};

export default SessionBookingForm;