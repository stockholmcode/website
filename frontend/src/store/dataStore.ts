import { Course, TeacherAvailability, Session, User } from '../types/session';

// Simple in-memory data store - in a real app, this would be a database
class DataStore {
  private courses: Course[] = [];
  private sessions: Session[] = [];
  private users: User[] = [];
  private listeners: (() => void)[] = [];

  // Course management
  addCourse(course: Course) {
    this.courses.push(course);
    this.notifyListeners();
  }

  updateCourse(courseId: string, updatedCourse: Course) {
    const index = this.courses.findIndex(c => c.id === courseId);
    if (index !== -1) {
      this.courses[index] = updatedCourse;
      this.notifyListeners();
    }
  }

  deleteCourse(courseId: string) {
    this.courses = this.courses.filter(c => c.id !== courseId);
    this.notifyListeners();
  }

  getCourses(): Course[] {
    return [...this.courses];
  }

  getCoursesByTeacher(teacherId: string): Course[] {
    return this.courses.filter(c => c.teacherId === teacherId);
  }

  getCoursesBySkill(skillName: string): Course[] {
    return this.courses.filter(c => 
      c.skillName.toLowerCase().includes(skillName.toLowerCase()) && c.isActive
    );
  }

  getCourse(courseId: string): Course | undefined {
    return this.courses.find(c => c.id === courseId);
  }

  // Availability management
  addAvailability(courseId: string, availability: TeacherAvailability) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.availabilities.push(availability);
      this.notifyListeners();
    }
  }

  addMultipleAvailabilities(courseId: string, availabilities: TeacherAvailability[]) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.availabilities.push(...availabilities);
      this.notifyListeners();
    }
  }

  updateAvailability(courseId: string, availabilityId: string, updatedAvailability: TeacherAvailability) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      const index = course.availabilities.findIndex(a => a.id === availabilityId);
      if (index !== -1) {
        course.availabilities[index] = updatedAvailability;
        this.notifyListeners();
      }
    }
  }

  deleteAvailability(courseId: string, availabilityId: string) {
    const course = this.courses.find(c => c.id === courseId);
    if (course) {
      course.availabilities = course.availabilities.filter(a => a.id !== availabilityId);
      this.notifyListeners();
    }
  }

  // Get all availabilities across all courses
  getAllAvailabilities(): TeacherAvailability[] {
    return this.courses.flatMap(course => course.availabilities);
  }

  // Get availabilities by skill
  getAvailabilitiesBySkill(skillName: string): TeacherAvailability[] {
    return this.courses
      .filter(course => 
        course.skillName.toLowerCase().includes(skillName.toLowerCase()) && course.isActive
      )
      .flatMap(course => course.availabilities.filter(a => a.isActive));
  }

  // Session management
  addSession(session: Session) {
    this.sessions.push(session);
    this.notifyListeners();
  }

  updateSession(sessionId: string, updatedSession: Session) {
    const index = this.sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      this.sessions[index] = updatedSession;
      this.notifyListeners();
    }
  }

  getSessions(): Session[] {
    return [...this.sessions];
  }

  getSessionsByUser(userId: string): Session[] {
    return this.sessions.filter(s => s.learnerId === userId || s.teacherId === userId);
  }

  // Utility methods for skill search
  getTeachersWithAvailabilities() {
    const teachersMap = new Map();
    
    this.courses.forEach(course => {
      if (course.isActive && course.availabilities.some(a => a.isActive)) {
        const teacherId = course.teacherId;
        
        if (!teachersMap.has(teacherId)) {
          const teacherUser = this.getUserById(teacherId);
          if (!teacherUser || teacherUser.userType !== 'teacher') return;
          
          teachersMap.set(teacherId, {
            id: teacherId,
            name: teacherUser.name,
            email: teacherUser.email,
            user: teacherUser,
            courses: [],
            availabilities: []
          });
        }
        
        const teacher = teachersMap.get(teacherId);
        teacher.courses.push(course);
        teacher.availabilities.push(...course.availabilities.filter(a => a.isActive));
      }
    });
    
    return Array.from(teachersMap.values());
  }


  // Search functionality
  searchTeachers(filters: {
    skill?: string;
    location?: string;
    maxDistance?: number;
    priceRange?: [number, number];
    format?: string;
  }) {
    let availabilities = this.getAllAvailabilities().filter(a => a.isActive);
    
    if (filters.skill) {
      availabilities = this.getAvailabilitiesBySkill(filters.skill);
    }
    
    // Group by teacher and create teacher objects for search results
    const teacherResults = new Map();
    
    availabilities.forEach(availability => {
      const course = this.courses.find(c => c.id === availability.courseId);
      if (!course || !course.isActive) return;
      
      const teacherId = course.teacherId;
      
      if (!teacherResults.has(teacherId)) {
        // Get real teacher user data
        const teacherUser = this.getUserById(teacherId);
        if (!teacherUser || teacherUser.userType !== 'teacher') return;
        
        teacherResults.set(teacherId, {
          id: teacherId,
          name: teacherUser.name,
          email: teacherUser.email,
          skill: course.skillName,
          price: course.cost,
          rating: 4.5 + Math.random() * 0.5, // Mock rating for now
          distance: Math.random() * 20, // Mock distance for now
          format: [course.format],
          location: availability.location || 'Online',
          experience: `${Math.floor(Math.random() * 10) + 1} years`, // Mock experience for now
          course: course,
          availabilities: [],
          user: teacherUser // Include full user object
        });
      }
      
      const teacher = teacherResults.get(teacherId);
      teacher.availabilities.push(availability);
      
      // Update format array if new format
      if (!teacher.format.includes(course.format)) {
        teacher.format.push(course.format);
      }
    });
    
    let results = Array.from(teacherResults.values());
    
    // Apply filters
    if (filters.priceRange) {
      results = results.filter(teacher => 
        teacher.price >= filters.priceRange![0] && 
        teacher.price <= filters.priceRange![1]
      );
    }
    
    if (filters.maxDistance) {
      results = results.filter(teacher => teacher.distance <= filters.maxDistance!);
    }
    
    if (filters.format && filters.format !== 'ALL') {
      results = results.filter(teacher => 
        teacher.format.some((f: string) => f === filters.format)
      );
    }
    
    return results;
  }

  // Subscription for components to listen to changes
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Initialize with some sample data
  initializeWithSampleData() {
    // Clear existing data
    this.courses = [];
    this.sessions = [];
    
    // Add sample teacher users first
    const sampleTeachers: User[] = [
      {
        id: 'teacher-1',
        email: 'alex.johnson@email.com',
        name: 'Alex Johnson',
        userType: 'teacher',
        authProvider: 'email',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'teacher-2', 
        email: 'sarah.mitchell@email.com',
        name: 'Sarah Mitchell',
        userType: 'teacher',
        authProvider: 'email',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'teacher-3',
        email: 'michael.chen@email.com', 
        name: 'Michael Chen',
        userType: 'teacher',
        authProvider: 'email',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'teacher-4',
        email: 'emma.garcia@email.com',
        name: 'Emma Garcia', 
        userType: 'teacher',
        authProvider: 'email',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
    
    // Add sample teachers to the store
    sampleTeachers.forEach(teacher => {
      this.users.push(teacher);
    });
    
    // Add some initial sample courses from different teachers
    const sampleCourses: Course[] = [
      {
        id: 'sample-1',
        teacherId: 'teacher-1',
        title: 'Beginner Guitar Fundamentals',
        description: 'Learn the basics of guitar playing including chords, strumming patterns, and simple songs. Perfect for complete beginners.',
        skillName: 'Guitar',
        cost: 50,
        duration: 60,
        format: 'IN_PERSON' as any,
        images: [],
        prerequisites: 'No experience required',
        learningObjectives: [
          'Master basic chord shapes (G, C, D, Em)',
          'Learn proper strumming techniques',
          'Play 3 simple songs'
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        availabilities: [
          {
            id: 'avail-1',
            teacherId: 'teacher-1',
            date: '2024-02-15',
            startTime: '10:00',
            endTime: '11:00',
            courseId: 'sample-1',
            courseName: 'Beginner Guitar Fundamentals',
            maxStudents: 3,
            location: '123 Music Studio, Room A',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'avail-2',
            teacherId: 'teacher-1',
            date: '2024-02-16',
            startTime: '14:00',
            endTime: '15:00',
            courseId: 'sample-1',
            courseName: 'Beginner Guitar Fundamentals',
            maxStudents: 3,
            location: '123 Music Studio, Room A',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      },
      {
        id: 'sample-2',
        teacherId: 'teacher-2',
        title: 'Python Programming for Beginners',
        description: 'Start your programming journey with Python. Learn variables, functions, loops, and build your first applications.',
        skillName: 'Python Programming',
        cost: 75,
        duration: 90,
        format: 'ONLINE' as any,
        images: [],
        prerequisites: 'Basic computer skills',
        learningObjectives: [
          'Understand Python syntax and variables',
          'Write functions and control structures',
          'Build simple applications'
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        availabilities: [
          {
            id: 'avail-3',
            teacherId: 'teacher-2',
            date: '2024-02-17',
            startTime: '18:00',
            endTime: '19:30',
            courseId: 'sample-2',
            courseName: 'Python Programming for Beginners',
            maxStudents: 5,
            virtualMeetingUrl: 'https://meet.google.com/python-basics',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      },
      {
        id: 'sample-3',
        teacherId: 'teacher-3',
        title: 'Spanish Conversation Practice',
        description: 'Improve your Spanish speaking skills through guided conversation practice. Focus on everyday situations and build confidence.',
        skillName: 'Spanish',
        cost: 45,
        duration: 60,
        format: 'HYBRID' as any,
        images: [],
        prerequisites: 'Basic Spanish knowledge',
        learningObjectives: [
          'Practice everyday conversations',
          'Improve pronunciation and fluency',
          'Learn colloquial expressions'
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        availabilities: [
          {
            id: 'avail-4',
            teacherId: 'teacher-3',
            date: '2024-02-18',
            startTime: '16:00',
            endTime: '17:00',
            courseId: 'sample-3',
            courseName: 'Spanish Conversation Practice',
            maxStudents: 4,
            location: 'Language Center, Room 205',
            virtualMeetingUrl: 'https://meet.google.com/spanish-conversation',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'avail-5',
            teacherId: 'teacher-3',
            date: '2024-02-19',
            startTime: '10:00',
            endTime: '11:00',
            courseId: 'sample-3',
            courseName: 'Spanish Conversation Practice',
            maxStudents: 4,
            location: 'Language Center, Room 205',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      },
      {
        id: 'sample-4',
        teacherId: 'teacher-4',
        title: 'Yoga for Beginners',
        description: 'Start your yoga journey with gentle poses, breathing techniques, and mindfulness practices. Perfect for complete beginners.',
        skillName: 'Yoga',
        cost: 40,
        duration: 75,
        format: 'IN_PERSON' as any,
        images: [],
        prerequisites: 'No experience required',
        learningObjectives: [
          'Learn basic yoga poses and alignment',
          'Practice breathing techniques',
          'Develop flexibility and mindfulness'
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        availabilities: [
          {
            id: 'avail-6',
            teacherId: 'teacher-4',
            date: '2024-02-20',
            startTime: '08:00',
            endTime: '09:15',
            courseId: 'sample-4',
            courseName: 'Yoga for Beginners',
            maxStudents: 8,
            location: 'Wellness Studio, Main Hall',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            id: 'avail-7',
            teacherId: 'teacher-4',
            date: '2024-02-21',
            startTime: '17:30',
            endTime: '18:45',
            courseId: 'sample-4',
            courseName: 'Yoga for Beginners',
            maxStudents: 8,
            location: 'Wellness Studio, Main Hall',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      },
      {
        id: 'sample-5',
        teacherId: 'teacher-1',
        title: 'Advanced Guitar Techniques',
        description: 'Master advanced guitar techniques including barre chords, fingerpicking, and music theory. Build on your existing skills.',
        skillName: 'Guitar',
        cost: 70,
        duration: 90,
        format: 'IN_PERSON' as any,
        images: [],
        prerequisites: 'Basic chord knowledge required',
        learningObjectives: [
          'Master barre chords and advanced progressions',
          'Learn fingerpicking patterns',
          'Understand music theory basics'
        ],
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        availabilities: [
          {
            id: 'avail-8',
            teacherId: 'teacher-1',
            date: '2024-02-22',
            startTime: '19:00',
            endTime: '20:30',
            courseId: 'sample-5',
            courseName: 'Advanced Guitar Techniques',
            maxStudents: 2,
            location: '123 Music Studio, Room B',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      }
    ];
    
    // Add sample courses to the store
    sampleCourses.forEach(course => {
      this.courses.push(course);
    });
  }

  // User management
  createUser(user: User): User {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === user.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    this.users.push(user);
    this.notifyListeners();
    return user;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByGoogleId(googleId: string): User | undefined {
    return this.users.find(u => u.googleId === googleId);
  }

  updateUser(userId: string, updatedUser: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser, updatedAt: new Date().toISOString() };
      this.notifyListeners();
      return this.users[index];
    }
    return undefined;
  }

  getAllUsers(): User[] {
    return [...this.users];
  }

  // Authentication helpers
  authenticateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user || user.authProvider !== 'email') {
      return null;
    }
    
    // In a real app, you'd use bcrypt to compare hashed passwords
    // For now, we'll do a simple comparison (NOT secure for production)
    if (user.passwordHash === this.hashPassword(password)) {
      return user;
    }
    
    return null;
  }

  // Simple password hashing (NOT secure for production - use bcrypt in real apps)
  private hashPassword(password: string): string {
    // This is just for demo purposes - use proper hashing in production
    return btoa(password + 'salt123');
  }

  hashPasswordForStorage(password: string): string {
    return this.hashPassword(password);
  }
}

// Export singleton instance
export const dataStore = new DataStore();

// Initialize the store
dataStore.initializeWithSampleData();