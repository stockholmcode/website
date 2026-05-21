import axios from 'axios';
import { Message, MessageRequest, SessionPlan, SessionPlanRequest } from '../types/message';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const messageAPI = {
  sendMessage: (userId: string, request: MessageRequest): Promise<Message> =>
    api.post('/messages', request, {
      headers: { 'User-Id': userId }
    }).then(response => response.data),

  getSessionMessages: (userId: string, sessionId: string): Promise<Message[]> =>
    api.get(`/messages/session/${sessionId}`, {
      headers: { 'User-Id': userId }
    }).then(response => response.data),

  markMessageAsRead: (userId: string, messageId: number): Promise<Message> =>
    api.put(`/messages/${messageId}/read`, {}, {
      headers: { 'User-Id': userId }
    }).then(response => response.data),

  getUnreadMessages: (userId: string): Promise<Message[]> =>
    api.get('/messages/unread', {
      headers: { 'User-Id': userId }
    }).then(response => response.data),

  getUnreadMessageCount: (userId: string): Promise<number> =>
    api.get('/messages/unread/count', {
      headers: { 'User-Id': userId }
    }).then(response => response.data.unreadCount),

  getUserConversations: (userId: string): Promise<Record<string, Message>> =>
    api.get('/messages/conversations', {
      headers: { 'User-Id': userId }
    }).then(response => response.data),
};

export const sessionPlanAPI = {
  createOrUpdateSessionPlan: (userId: string, request: SessionPlanRequest): Promise<SessionPlan> =>
    api.post('/session-plans', request, {
      headers: { 'User-Id': userId }
    }).then(response => response.data),

  getSessionPlan: (userId: string, sessionId: string): Promise<SessionPlan | null> =>
    api.get(`/session-plans/session/${sessionId}`, {
      headers: { 'User-Id': userId }
    }).then(response => response.data)
    .catch(error => {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }),

  markSessionPlanCompleted: (userId: string, sessionId: string): Promise<SessionPlan> =>
    api.put(`/session-plans/session/${sessionId}/complete`, {}, {
      headers: { 'User-Id': userId }
    }).then(response => response.data),

  deleteSessionPlan: (userId: string, sessionId: string): Promise<void> =>
    api.delete(`/session-plans/session/${sessionId}`, {
      headers: { 'User-Id': userId }
    }),
};