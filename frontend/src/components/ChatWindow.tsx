import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Message, MessageType, MessageRequest } from '../types/message';
import { messageAPI } from '../services/messageApi';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
`;

const ChatTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
  align-self: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  background: ${props => props.isOwn ? '#007bff' : '#e9ecef'};
  color: ${props => props.isOwn ? 'white' : '#333'};
  border-bottom-right-radius: ${props => props.isOwn ? '4px' : '18px'};
  border-bottom-left-radius: ${props => props.isOwn ? '18px' : '4px'};
`;

const MessageInfo = styled.div<{ isOwn: boolean }>`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
  text-align: ${props => props.isOwn ? 'right' : 'left'};
`;

const MessageTypeTag = styled.span<{ messageType: MessageType }>`
  display: inline-block;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  font-size: 0.625rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  background: ${props => {
    switch (props.messageType) {
      case MessageType.LOCATION: return '#28a745';
      case MessageType.EQUIPMENT_LIST: return '#ffc107';
      case MessageType.EMERGENCY_CONTACT: return '#dc3545';
      case MessageType.SESSION_REMINDER: return '#6f42c1';
      default: return 'transparent';
    }
  }};
  color: ${props => props.messageType === MessageType.TEXT ? 'transparent' : 'white'};
`;

const MessageInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 0.5rem;
`;

const TextInput = styled.textarea`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const TypeSelector = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

interface ChatWindowProps {
  sessionId: string;
  currentUserId: string;
  otherUserId: string;
  otherUserName?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  sessionId, 
  currentUserId, 
  otherUserId, 
  otherUserName 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>(MessageType.TEXT);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [sessionId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    
    try {
      const messagesData = await messageAPI.getSessionMessages(currentUserId, sessionId);
      setMessages(messagesData);
      
      // Mark unread messages as read
      const unreadMessages = messagesData.filter(
        msg => msg.receiverId === currentUserId && !msg.isRead
      );
      
      for (const message of unreadMessages) {
        try {
          await messageAPI.markMessageAsRead(currentUserId, message.id);
        } catch (err) {
          console.error('Failed to mark message as read:', err);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    setError('');
    
    try {
      const request: MessageRequest = {
        sessionId,
        receiverId: otherUserId,
        content: newMessage.trim(),
        messageType
      };
      
      const sentMessage = await messageAPI.sendMessage(currentUserId, request);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      setMessageType(MessageType.TEXT);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageTypeLabel = (type: MessageType) => {
    switch (type) {
      case MessageType.LOCATION: return 'Location';
      case MessageType.EQUIPMENT_LIST: return 'Equipment';
      case MessageType.EMERGENCY_CONTACT: return 'Emergency';
      case MessageType.SESSION_REMINDER: return 'Reminder';
      case MessageType.SYSTEM_NOTIFICATION: return 'System';
      default: return '';
    }
  };

  if (loading) return <LoadingMessage>Loading chat...</LoadingMessage>;

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>
          Chat with {otherUserName || `User ${otherUserId}`}
        </ChatTitle>
      </ChatHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <MessagesContainer>
        {messages.map(message => (
          <div key={message.id}>
            <MessageBubble isOwn={message.senderId === currentUserId}>
              {message.messageType !== MessageType.TEXT && (
                <MessageTypeTag messageType={message.messageType}>
                  {getMessageTypeLabel(message.messageType)}
                </MessageTypeTag>
              )}
              <div>{message.content}</div>
              <MessageInfo isOwn={message.senderId === currentUserId}>
                {format(new Date(message.sentAt), 'h:mm a')}
                {message.senderId === currentUserId && (
                  <span> • {message.isRead ? 'Read' : 'Sent'}</span>
                )}
              </MessageInfo>
            </MessageBubble>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <MessageInput>
        <div style={{ flex: 1 }}>
          <TypeSelector 
            value={messageType} 
            onChange={(e) => setMessageType(e.target.value as MessageType)}
          >
            <option value={MessageType.TEXT}>Regular Message</option>
            <option value={MessageType.LOCATION}>Share Location</option>
            <option value={MessageType.EQUIPMENT_LIST}>Equipment List</option>
            <option value={MessageType.EMERGENCY_CONTACT}>Emergency Contact</option>
          </TypeSelector>
          <TextInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
          />
        </div>
        <SendButton 
          onClick={handleSendMessage} 
          disabled={sending || !newMessage.trim()}
        >
          ➤
        </SendButton>
      </MessageInput>
    </ChatContainer>
  );
};

export default ChatWindow;