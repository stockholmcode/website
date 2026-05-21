import React from 'react';
import styled from 'styled-components';
import { SessionBookingRequest, SessionFormat } from '../types/session';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const Label = styled.span`
  font-weight: 500;
  color: #555;
`;

const Value = styled.span`
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  ` : `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  `}
  
  &:disabled {
    background: #dee2e6;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const CalendarPrompt = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
`;

const CalendarButton = styled.button`
  background: none;
  border: 1px solid #007bff;
  color: #007bff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.25rem;
  
  &:hover {
    background: #007bff;
    color: white;
  }
`;

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingData: SessionBookingRequest;
  isSubmitting: boolean;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingData,
  isSubmitting
}) => {
  if (!isOpen) return null;

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = () => {
    // Default to 1 hour duration since teacher sets this in their session setup
    return '1 hour';
  };

  const getEndTime = () => {
    if (bookingData.startTime) {
      const start = new Date(bookingData.startTime);
      // Add 1 hour as default duration
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return end;
    }
    return new Date();
  };

  const generateCalendarLinks = () => {
    const startDate = new Date(bookingData.startTime);
    const endDate = getEndTime();
    const startTime = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = encodeURIComponent(`Learning Session: ${bookingData.skillName}`);
    const details = encodeURIComponent(`Skill: ${bookingData.skillName}\nDuration: 1 hour\n${bookingData.location ? `Location: ${bookingData.location}` : ''}${bookingData.virtualMeetingUrl ? `Meeting URL: ${bookingData.virtualMeetingUrl}` : ''}`);

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startTime}&enddt=${endTime}&body=${details}`
    };
  };

  const calendarLinks = generateCalendarLinks();

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Confirm Your Booking</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <DetailRow>
          <Label>Skill:</Label>
          <Value>{bookingData.skillName}</Value>
        </DetailRow>

        <DetailRow>
          <Label>Start Time:</Label>
          <Value>{formatDateTime(bookingData.startTime)}</Value>
        </DetailRow>

        <DetailRow>
          <Label>End Time:</Label>
          <Value>{formatDateTime(getEndTime().toISOString())}</Value>
        </DetailRow>

        <DetailRow>
          <Label>Duration:</Label>
          <Value>{getDuration()}</Value>
        </DetailRow>

        {bookingData.location && (
          <DetailRow>
            <Label>Location:</Label>
            <Value>{bookingData.location}</Value>
          </DetailRow>
        )}

        {bookingData.virtualMeetingUrl && (
          <DetailRow>
            <Label>Meeting URL:</Label>
            <Value>{bookingData.virtualMeetingUrl}</Value>
          </DetailRow>
        )}

        {bookingData.learnerGoals && (
          <DetailRow>
            <Label>Learning Goals:</Label>
            <Value>{bookingData.learnerGoals}</Value>
          </DetailRow>
        )}

        {bookingData.preparationNotes && (
          <DetailRow>
            <Label>Preparation Notes:</Label>
            <Value>{bookingData.preparationNotes}</Value>
          </DetailRow>
        )}

        <CalendarPrompt>
          <h4>Add to Calendar</h4>
          <p>Save this session to your calendar:</p>
          <div>
            <CalendarButton
              onClick={() => window.open(calendarLinks.google, '_blank')}
            >
              📅 Google Calendar
            </CalendarButton>
            <CalendarButton
              onClick={() => window.open(calendarLinks.outlook, '_blank')}
            >
              📅 Outlook
            </CalendarButton>
          </div>
        </CalendarPrompt>

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BookingConfirmationModal;