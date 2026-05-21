import axios from 'axios';
import { Session, SessionBookingRequest, SessionCancellationRequest, TeacherAvailability } from '../types/session';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log booking requests for debugging
  if (config.url?.includes('/sessions') && config.method?.toUpperCase() === 'POST') {
    console.log('🚀 Booking Request:', config.data);
  }
  
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('/sessions') && response.config.method?.toUpperCase() === 'POST') {
      console.log('✅ Booking Success:', response.data);
    }
    return response;
  },
  (error) => {
    if (error.config?.url?.includes('/sessions')) {
      console.log('❌ Booking Error:', error.response?.status, error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);

export const sessionAPI = {
  bookSession: (request: SessionBookingRequest): Promise<Session> =>
    api.post('/api/v1/sessions', request).then(response => response.data),

  getSession: (id: string): Promise<Session> =>
    api.get(`/api/v1/sessions/${id}`).then(response => response.data),

  confirmSession: (id: string): Promise<Session> =>
    api.put(`/api/v1/sessions/${id}/confirm`).then(response => response.data),

  cancelSession: (id: string, request: SessionCancellationRequest): Promise<Session> =>
    api.put(`/api/v1/sessions/${id}/cancel`, request).then(response => response.data),

  rescheduleSession: (id: string, startTime: string, endTime: string): Promise<Session> =>
    api.put(`/api/v1/sessions/${id}/reschedule`, null, {
      params: { newStartTime: startTime, newEndTime: endTime }
    }).then(response => response.data),

  getSessionsByUser: (userId: string): Promise<Session[]> =>
    api.get(`/api/v1/sessions/user/${userId}`).then(response => response.data),
};

export const availabilityAPI = {
  getTeacherAvailability: (teacherId: string): Promise<TeacherAvailability[]> =>
    api.get(`/availability/teacher/${teacherId}`).then(response => response.data),

  addAvailability: (availability: Omit<TeacherAvailability, 'id'>): Promise<TeacherAvailability> =>
    api.post('/availability', availability).then(response => response.data),

  updateAvailability: (id: number, availability: Partial<TeacherAvailability>): Promise<TeacherAvailability> =>
    api.put(`/availability/${id}`, availability).then(response => response.data),

  deleteAvailability: (id: number): Promise<void> =>
    api.delete(`/availability/${id}`),
};

export const authAPI = {
  login: (email: string, password: string, userType: string) =>
    api.post('/api/v1/auth/login', { email, password, userType }).then(response => response.data),

  signup: (firstName: string, lastName: string, email: string, password: string, confirmPassword: string, userType: string) =>
    api.post('/api/v1/auth/signup', { firstName, lastName, email, password, confirmPassword, userType }).then(response => response.data),

  getCurrentUser: (token: string) =>
    api.get('/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(response => response.data),
};

export const coursesAPI = {
  getAllCourses: () =>
    api.get('/api/v1/courses').then(response => response.data),

  getCoursesByTeacher: (teacherId: string) =>
    api.get('/api/v1/courses', { params: { teacherId } }).then(response => response.data),

  getCourseById: (courseId: string) =>
    api.get(`/api/v1/courses/${courseId}`).then(response => response.data),

  createCourse: (courseData: any) =>
    api.post('/api/v1/courses', courseData).then(response => response.data),

  updateCourse: (courseId: string, courseData: any) =>
    api.put(`/api/v1/courses/${courseId}`, courseData).then(response => response.data),

  deleteCourse: (courseId: string) =>
    api.delete(`/api/v1/courses/${courseId}`).then(response => response.data),

  addAvailability: (courseId: string, availabilityData: any) =>
    api.post(`/api/v1/courses/${courseId}/availabilities`, availabilityData).then(response => response.data),

  addMultipleAvailabilities: (courseId: string, availabilitiesData: any) =>
    api.post(`/api/v1/courses/${courseId}/availabilities/multiple`, availabilitiesData).then(response => response.data),

  searchTeachers: (searchParams: any) =>
    api.post('/api/v1/search/teachers', searchParams).then(response => response.data),
};

export const healthAPI = {
  checkHealth: (): Promise<{ status: string; timestamp: string }> =>
    api.get('/health').then(response => response.data),
};