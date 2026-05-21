import React, { useState } from 'react';
import styled from 'styled-components';
import { Session, SessionStatus } from '../types/session';

const ControlsContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ControlsTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const ControlButton = styled.button<{ variant: 'start' | 'pause' | 'end' | 'secondary' }>`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  
  ${props => {
    switch (props.variant) {
      case 'start':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
        `;
      case 'pause':
        return `
          background: #ffc107;
          color: #212529;
          &:hover { background: #e0a800; }
        `;
      case 'end':
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusIndicator = styled.div<{ status: SessionStatus }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#fff3cd';
      case SessionStatus.CONFIRMED: return '#cce5ff';
      case SessionStatus.IN_PROGRESS: return '#d4edda';
      case SessionStatus.COMPLETED: return '#e2e3e5';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#856404';
      case SessionStatus.CONFIRMED: return '#004085';
      case SessionStatus.IN_PROGRESS: return '#155724';
      case SessionStatus.COMPLETED: return '#383d41';
      default: return '#495057';
    }
  }};
`;

const StatusDot = styled.div<{ status: SessionStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case SessionStatus.PENDING: return '#ffc107';
      case SessionStatus.CONFIRMED: return '#007bff';
      case SessionStatus.IN_PROGRESS: return '#28a745';
      case SessionStatus.COMPLETED: return '#6c757d';
      default: return '#6c757d';
    }
  }};
  animation: ${props => props.status === SessionStatus.IN_PROGRESS ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ConfirmModal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
`;

const ModalText = styled.p`
  margin: 0 0 1.5rem 0;
  color: #666;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ModalButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #dc3545;
    color: white;
    &:hover { background: #c82333; }
  ` : `
    background: #6c757d;
    color: white;
    &:hover { background: #545b62; }
  `}
`;

interface SessionControlsProps {
  session: Session;
  onStartSession: () => void;
  onEndSession: () => void;
  sessionStarted: boolean;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  session,
  onStartSession,
  onEndSession,
  sessionStarted
}) => {
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);

  const handleStartSession = () => {
    onStartSession();
  };

  const handlePauseSession = () => {
    setSessionPaused(!sessionPaused);
    // In real app, would call API to pause/resume session
  };

  const handleEndSession = () => {
    setShowEndConfirm(true);
  };

  const confirmEndSession = () => {
    onEndSession();
    setShowEndConfirm(false);
  };

  const getStatusText = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.PENDING: return 'Waiting for confirmation';
      case SessionStatus.CONFIRMED: return 'Ready to start';
      case SessionStatus.IN_PROGRESS: return sessionPaused ? 'Session paused' : 'Session in progress';
      case SessionStatus.COMPLETED: return 'Session completed';
      default: return 'Unknown status';
    }
  };

  const canStartSession = session.status === SessionStatus.CONFIRMED && !sessionStarted;
  const canControlSession = sessionStarted && session.status === SessionStatus.IN_PROGRESS;
  const canEndSession = sessionStarted && session.status === SessionStatus.IN_PROGRESS;

  return (
    <>
      <ControlsContainer>
        <ControlsTitle>Session Controls</ControlsTitle>
        
        <StatusIndicator status={session.status}>
          <StatusDot status={session.status} />
          <span>{getStatusText(session.status)}</span>
        </StatusIndicator>
        
        {canStartSession && (
          <ControlButton variant="start" onClick={handleStartSession}>
            ▶️ Start Session
          </ControlButton>
        )}
        
        {canControlSession && (
          <ControlButton 
            variant="pause" 
            onClick={handlePauseSession}
          >
            {sessionPaused ? '▶️ Resume Session' : '⏸️ Pause Session'}
          </ControlButton>
        )}
        
        {canEndSession && (
          <ControlButton variant="end" onClick={handleEndSession}>
            ⏹️ End Session
          </ControlButton>
        )}
        
        {session.status === SessionStatus.COMPLETED && (
          <ControlButton variant="secondary" disabled>
            ✅ Session Completed
          </ControlButton>
        )}
        
        {session.status === SessionStatus.PENDING && (
          <ControlButton variant="secondary" disabled>
            ⏳ Waiting for Confirmation
          </ControlButton>
        )}
      </ControlsContainer>

      <ConfirmModal isOpen={showEndConfirm}>
        <ModalContent>
          <ModalTitle>End Session</ModalTitle>
          <ModalText>
            Are you sure you want to end this session? This action cannot be undone.
          </ModalText>
          <ModalButtons>
            <ModalButton variant="secondary" onClick={() => setShowEndConfirm(false)}>
              Cancel
            </ModalButton>
            <ModalButton variant="primary" onClick={confirmEndSession}>
              End Session
            </ModalButton>
          </ModalButtons>
        </ModalContent>
      </ConfirmModal>
    </>
  );
};

export default SessionControls;