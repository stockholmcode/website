export interface Message {
  id: number;
  sessionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: MessageType;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  LOCATION = 'LOCATION',
  EQUIPMENT_LIST = 'EQUIPMENT_LIST',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  SESSION_REMINDER = 'SESSION_REMINDER',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION'
}

export interface MessageRequest {
  sessionId: string;
  receiverId: string;
  content: string;
  messageType: MessageType;
}

export interface SessionPlan {
  id: number;
  sessionId: string;
  learningObjectives?: string;
  materialsNeeded?: string;
  locationDetails?: string;
  emergencyContact?: string;
  specialInstructions?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionPlanRequest {
  sessionId: string;
  learningObjectives?: string;
  materialsNeeded?: string;
  locationDetails?: string;
  emergencyContact?: string;
  specialInstructions?: string;
}