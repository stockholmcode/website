# CLE Platform Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the Spring Boot backend for the CLE platform.

## 🎯 Overview

The integration involves replacing the frontend's in-memory `dataStore` with real API calls to the backend server.

## 🔄 Integration Steps

### Step 1: Create API Service Layer

Create a new API service to handle backend communication:

```typescript
// frontend/src/services/backendApi.ts
export class BackendApiService {
  private baseUrl = 'http://localhost:8080/api/v1';
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Authentication methods
  async login(email: string, password: string, userType: string) {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    });
    
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async signup(userData: SignupData) {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<UserResponse>('/auth/me');
  }

  // Course methods
  async getCourses(teacherId?: string) {
    const params = teacherId ? `?teacherId=${teacherId}` : '';
    return this.request<CourseResponse[]>(`/courses${params}`);
  }

  async createCourse(courseData: CourseCreateRequest) {
    return this.request<CourseResponse>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(courseId: string, courseData: Partial<CourseCreateRequest>) {
    return this.request<CourseResponse>(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(courseId: string) {
    return this.request(`/courses/${courseId}`, { method: 'DELETE' });
  }

  // Availability methods
  async addAvailability(courseId: string, availabilityData: AvailabilityCreateRequest) {
    return this.request<AvailabilityResponse>(`/courses/${courseId}/availabilities`, {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    });
  }

  async addMultipleAvailabilities(courseId: string, availabilities: AvailabilityCreateRequest[]) {
    return this.request<AvailabilityResponse[]>(`/courses/${courseId}/availabilities/multiple`, {
      method: 'POST',
      body: JSON.stringify({ availabilities }),
    });
  }

  // Search methods
  async searchTeachers(searchFilters: TeacherSearchRequest) {
    return this.request<SearchResultsResponse>('/search/teachers', {
      method: 'POST',
      body: JSON.stringify(searchFilters),
    });
  }

  async getSkills() {
    return this.request<SkillResponse[]>('/search/skills');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
}

export const backendApi = new BackendApiService();
```

### Step 2: Update Type Definitions

Update the types to match the backend API:

```typescript
// frontend/src/types/api.ts
export interface AuthResponse {
  token: string;
  user: UserResponse;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  userType: 'TEACHER' | 'LEARNER';
  authProvider: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseResponse {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  skillName: string;
  cost: number;
  duration: number;
  format: 'ONLINE' | 'IN_PERSON' | 'HYBRID';
  images: string[];
  prerequisites?: string;
  learningObjectives: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  availabilities: AvailabilityResponse[];
}

export interface AvailabilityResponse {
  id: string;
  teacherId: string;
  courseId: string;
  courseName: string;
  date: string; // LocalDate as string
  startTime: string; // LocalTime as string
  endTime: string; // LocalTime as string
  maxStudents: number;
  location?: string;
  virtualMeetingUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSearchRequest {
  skill?: string;
  location?: string;
  maxDistance?: number;
  priceRange?: [number, number];
  format?: string;
}

export interface SearchResultsResponse {
  results: TeacherSearchResult[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface TeacherSearchResult {
  id: string;
  name: string;
  email: string;
  skill: string;
  price: number;
  rating: number;
  distance: number;
  format: string[];
  location: string;
  experience: string;
  course: CourseResponse;
  availabilities: AvailabilityResponse[];
  user: UserResponse;
}
```

### Step 3: Update Authentication Components

Replace the mock authentication in `LoginPage.tsx` and `SignUpPage.tsx`:

```typescript
// frontend/src/components/LoginPage.tsx
import { backendApi } from '../services/backendApi';

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await backendApi.login(email, password, userType);
    onLogin(userType as UserType, response.user);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

```typescript
// frontend/src/components/SignUpPage.tsx
import { backendApi } from '../services/backendApi';

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  try {
    setError('');
    
    // Form validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType
    };

    const response = await backendApi.signup(userData);
    onSignUp(userType as UserType, response.user);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Registration failed');
  }
};
```

### Step 4: Update Course Management

Replace the dataStore calls in `CourseManagement.tsx`:

```typescript
// frontend/src/components/CourseManagement.tsx
import { backendApi } from '../services/backendApi';

const CourseManagement: React.FC<CourseManagementProps> = ({ user }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load courses from backend
  useEffect(() => {
    const loadCourses = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const backendCourses = await backendApi.getCourses(user.id);
        // Convert backend format to frontend format if needed
        setCourses(backendCourses.map(convertBackendCourse));
      } catch (err) {
        setError('Failed to load courses');
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user?.id]);

  // Create course
  const handleCourseSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      
      const courseData = {
        title: courseFormData.title,
        description: courseFormData.description,
        skillName: courseFormData.skillName,
        cost: courseFormData.cost,
        duration: courseFormData.duration,
        format: courseFormData.format,
        prerequisites: courseFormData.prerequisites,
        learningObjectives: courseFormData.learningObjectives,
        images: courseFormData.images
      };

      if (editingCourse) {
        const updatedCourse = await backendApi.updateCourse(editingCourse.id, courseData);
        setCourses(courses.map(c => c.id === editingCourse.id ? convertBackendCourse(updatedCourse) : c));
      } else {
        const newCourse = await backendApi.createCourse(courseData);
        setCourses([...courses, convertBackendCourse(newCourse)]);
      }

      closeModal();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    }
  };

  // Add multiple availabilities
  const handleMultipleAvailabilitySubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) return;

    try {
      setError('');
      
      const availabilityData = multipleAvailabilityData.map(slot => ({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxStudents: slot.maxStudents,
        location: slot.location,
        virtualMeetingUrl: slot.virtualMeetingUrl
      }));

      await backendApi.addMultipleAvailabilities(selectedCourse.id, availabilityData);
      
      // Reload courses to get updated availabilities
      const updatedCourses = await backendApi.getCourses(user?.id);
      setCourses(updatedCourses.map(convertBackendCourse));
      
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add availabilities');
    }
  };

  // Helper function to convert backend course format to frontend format
  const convertBackendCourse = (backendCourse: any): Course => {
    return {
      id: backendCourse.id,
      teacherId: backendCourse.teacherId,
      title: backendCourse.title,
      description: backendCourse.description,
      skillName: backendCourse.skillName,
      cost: backendCourse.cost,
      duration: backendCourse.duration,
      format: backendCourse.format,
      images: backendCourse.images || [],
      prerequisites: backendCourse.prerequisites,
      learningObjectives: backendCourse.learningObjectives || [],
      isActive: backendCourse.isActive,
      createdAt: backendCourse.createdAt,
      updatedAt: backendCourse.updatedAt,
      availabilities: backendCourse.availabilities?.map((avail: any) => ({
        id: avail.id,
        teacherId: avail.teacherId,
        courseId: avail.courseId,
        courseName: avail.courseName,
        date: avail.date,
        startTime: avail.startTime,
        endTime: avail.endTime,
        maxStudents: avail.maxStudents,
        location: avail.location,
        virtualMeetingUrl: avail.virtualMeetingUrl,
        isActive: avail.isActive,
        createdAt: avail.createdAt,
        updatedAt: avail.updatedAt
      })) || []
    };
  };

  // ... rest of component
};
```

### Step 5: Update Teacher Search

Replace the dataStore search in `SkillSearch.tsx`:

```typescript
// frontend/src/components/SkillSearch.tsx
import { backendApi } from '../services/backendApi';

const SkillSearch: React.FC<SkillSearchProps> = ({ onTeacherSelect, initialSkill = '', initialLocation = '' }) => {
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [filters, setFilters] = useState<Filters>({
    location: initialLocation,
    maxDistance: 25,
    priceRange: [0, 200],
    format: 'ALL'
  });
  const [results, setResults] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Load available skills
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skillsResponse = await backendApi.getSkills();
        setSkills(skillsResponse.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category
        })));
      } catch (err) {
        console.error('Failed to load skills:', err);
        // Fallback to static skills if API fails
        setSkills(AVAILABLE_SKILLS);
      }
    };

    loadSkills();
  }, []);

  // Trigger search when skill or filters change
  useEffect(() => {
    if (selectedSkill) {
      handleSearch();
    }
  }, [selectedSkill, filters]);

  const handleSearch = async () => {
    if (!selectedSkill) return;

    setLoading(true);
    try {
      const searchRequest = {
        skill: selectedSkill,
        location: filters.location || undefined,
        maxDistance: filters.maxDistance,
        priceRange: [filters.priceRange[0], filters.priceRange[1]],
        format: filters.format === 'ALL' ? undefined : filters.format
      };

      const response = await backendApi.searchTeachers(searchRequest);
      
      // Convert backend results to frontend format
      const convertedResults = response.results.map(result => ({
        id: result.id,
        name: result.name,
        skill: result.skill,
        price: result.price,
        rating: result.rating,
        distance: result.distance,
        format: result.format,
        location: result.location,
        experience: result.experience,
        course: result.course,
        availabilities: result.availabilities
      }));

      setResults(convertedResults);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### Step 6: Update App.tsx Authentication

Update the main app to handle real authentication:

```typescript
// frontend/src/App.tsx
import { backendApi } from './services/backendApi';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  
  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const currentUser = await backendApi.getCurrentUser();
          setUser(currentUser);
          setAppState('authenticated');
        } catch (err) {
          // Token invalid, clear it
          localStorage.removeItem('authToken');
          backendApi.logout();
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userType: UserType, userData: User) => {
    setUser(userData);
    setAppState('authenticated');
    
    if (userData.userType === 'TEACHER') {
      setCurrentView('dashboard');
    } else {
      setCurrentView('search');
    }
  };

  const handleLogout = () => {
    backendApi.logout();
    setUser(null);
    setAppState('landing');
    setCurrentView('home');
  };

  // ... rest of component
};
```

### Step 7: Environment Configuration

Create environment configuration for different environments:

```typescript
// frontend/src/config/environment.ts
const config = {
  development: {
    apiBaseUrl: 'http://localhost:8080/api/v1',
  },
  production: {
    apiBaseUrl: 'https://your-backend-domain.com/api/v1',
  }
};

export const environment = config[process.env.NODE_ENV as keyof typeof config] || config.development;
```

### Step 8: Error Handling

Add global error handling for API calls:

```typescript
// frontend/src/services/errorHandler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message;
    }
  }
  
  return 'An unexpected error occurred.';
};
```

## 🧪 Testing Integration

### 1. Start Backend Server
```bash
cd /Users/nivinfakih/Documents/cle
./gradlew bootRun
```

### 2. Start Frontend Development Server
```bash
cd /Users/nivinfakih/Documents/cle/frontend
npm start
```

### 3. Test Authentication Flow
1. Go to http://localhost:3000
2. Click "Sign Up" and create a teacher account
3. Login with the new credentials
4. Verify you can access the teacher dashboard

### 4. Test Course Management
1. Create a new course as a teacher
2. Add availability slots
3. Verify the course appears in your dashboard

### 5. Test Teacher Search
1. Logout and browse as a guest, or create a learner account
2. Search for teachers by skill
3. Verify you see the courses created by teachers
4. Check that availability information is accurate

## 🔍 Debugging Integration Issues

### Common Issues and Solutions

1. **CORS Errors**
   - Backend already configured for `localhost:3000` and `localhost:3001`
   - Check browser console for specific CORS messages

2. **Authentication Issues**
   - Check JWT token in localStorage
   - Verify token format in Authorization headers
   - Check backend logs for authentication errors

3. **Data Format Mismatches**
   - Backend uses different field names (camelCase vs snake_case)
   - Date/time formats may differ
   - Use converter functions to transform data

4. **Network Errors**
   - Ensure backend is running on port 8080
   - Check frontend API base URL configuration
   - Verify endpoint URLs match backend routes

### Debug Tools
1. **Browser DevTools** - Network tab to see API calls
2. **Backend Logs** - Check Spring Boot console output
3. **H2 Console** - http://localhost:8080/h2-console to verify data
4. **API Testing** - Use Postman or curl to test endpoints directly

## 🚀 Deployment Considerations

### Environment Variables
```bash
# Frontend (.env.production)
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api/v1

# Backend (application-prod.yml)
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
```

### CORS Configuration for Production
Update backend CORS configuration for production domains:

```kotlin
configuration.allowedOriginPatterns = listOf(
  "http://localhost:*", 
  "https://localhost:*",
  "https://your-frontend-domain.com"
)
```

---

**Success!** 🎉 Your frontend is now connected to a real backend with persistent data, authentication, and all the features needed for the CLE platform!