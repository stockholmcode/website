export type UserType = 'teacher' | 'learner';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  passwordHash?: string;
  authProvider: 'email' | 'google';
  googleId?: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  teacherId: string;
  learnerId: string;
  skillName: string;
  courseId?: string;
  courseName?: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  format: SessionFormat;
  price: number;
  sessionNotes?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export enum SessionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum SessionFormat {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON',
  HYBRID = 'HYBRID'
}

export interface SessionBookingRequest {
  teacherId: string;
  learnerId: string;
  skillName: string;
  startTime: string;
  endTime: string;
  format: SessionFormat;
  duration?: string;
  location?: string;
  virtualMeetingUrl?: string;
  price: number;
  learnerGoals?: string;
  preparationNotes?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  billingName?: string;
}

export interface SessionCancellationRequest {
  reason: string;
}

export interface TeacherAvailability {
  id: string;
  teacherId: string;
  date: string; // YYYY-MM-DD format
  startTime: string;
  endTime: string;
  courseId: string;
  courseName?: string;
  maxStudents: number;
  virtualMeetingUrl?: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  skillName: string;
  cost: number;
  duration: number; // in minutes
  format: SessionFormat;
  images: string[];
  prerequisites?: string;
  learningObjectives: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  availabilities: TeacherAvailability[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

// Centralized skills data for consistency across components
export const AVAILABLE_SKILLS: Skill[] = [
  // Music
  { id: '1', name: 'Guitar', category: 'Music', description: 'String instrument lessons' },
  { id: '2', name: 'Piano', category: 'Music', description: 'Keyboard instrument lessons' },
  { id: '3', name: 'Voice', category: 'Music', description: 'Vocal training and singing lessons' },
  { id: '4', name: 'Drums', category: 'Music', description: 'Percussion instrument lessons' },
  
  // Programming & Technology
  { id: '5', name: 'Python Programming', category: 'Technology', description: 'Python programming language' },
  { id: '6', name: 'Web Development', category: 'Technology', description: 'HTML, CSS, JavaScript web development' },
  { id: '7', name: 'JavaScript', category: 'Technology', description: 'JavaScript programming language' },
  { id: '8', name: 'React', category: 'Technology', description: 'React framework development' },
  { id: '9', name: 'Data Science', category: 'Technology', description: 'Data analysis and machine learning' },
  
  // Languages
  { id: '10', name: 'Spanish', category: 'Language', description: 'Spanish language learning' },
  { id: '11', name: 'French', category: 'Language', description: 'French language learning' },
  { id: '12', name: 'Japanese', category: 'Language', description: 'Japanese language learning' },
  { id: '13', name: 'Italian', category: 'Language', description: 'Italian language learning' },
  
  // Fitness & Wellness
  { id: '14', name: 'Yoga', category: 'Fitness', description: 'Yoga instruction and practice' },
  { id: '15', name: 'Personal Training', category: 'Fitness', description: 'Fitness and strength training' },
  { id: '16', name: 'Meditation', category: 'Wellness', description: 'Mindfulness and meditation practice' },
  { id: '17', name: 'Tai Chi', category: 'Wellness', description: 'Traditional Chinese martial art' },
  
  // Academic
  { id: '18', name: 'Math', category: 'Academic', description: 'Mathematics tutoring' },
  { id: '19', name: 'English', category: 'Academic', description: 'English language and literature' },
  { id: '20', name: 'Physics', category: 'Academic', description: 'Physics tutoring and concepts' },
  { id: '21', name: 'Advanced Mathematics', category: 'Academic', description: 'Advanced math topics and calculus' },
  
  // Creative Arts
  { id: '22', name: 'Photography', category: 'Art', description: 'Photography techniques and composition' },
  { id: '23', name: 'Drawing', category: 'Art', description: 'Drawing and sketching techniques' },
  { id: '24', name: 'Cooking', category: 'Culinary', description: 'Cooking techniques and recipes' },
  { id: '25', name: 'Baking', category: 'Culinary', description: 'Baking and pastry techniques' },
  { id: '26', name: 'Woodworking', category: 'Craft', description: 'Woodworking and carpentry skills' },
  
  // Business
  { id: '27', name: 'Business English', category: 'Business', description: 'Professional English communication' },
  { id: '28', name: 'Excel Training', category: 'Business', description: 'Microsoft Excel skills and training' }
];

export interface CourseCreateRequest {
  title: string;
  description: string;
  skillName: string;
  cost: number;
  duration: number;
  format: SessionFormat;
  prerequisites?: string;
  learningObjectives: string[];
}

export interface AvailabilityCreateRequest {
  date: string;
  startTime: string;
  endTime: string;
  courseId: string;
  maxStudents: number;
  virtualMeetingUrl?: string;
  location?: string;
}

export interface MultipleAvailabilityCreateRequest {
  courseId: string;
  maxStudents: number;
  virtualMeetingUrl?: string;
  location?: string;
  timeSlots: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}