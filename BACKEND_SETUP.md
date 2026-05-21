# CLE Platform Backend Setup Guide

This guide explains how to set up and run the CLE (Community Learning Exchange) backend server.

## 📋 Prerequisites

### Required Software
1. **Java 17 or higher**
   ```bash
   # Install using Homebrew (macOS)
   brew install openjdk@17
   
   # Or download from Oracle/OpenJDK website
   # https://jdk.java.net/17/
   ```

2. **Set JAVA_HOME** (if needed)
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export JAVA_HOME=/opt/homebrew/Cellar/openjdk@17/17.0.8/libexec/openjdk.jdk/Contents/Home
   export PATH=$JAVA_HOME/bin:$PATH
   ```

3. **Git** (for version control)
   ```bash
   brew install git
   ```

## 🚀 Quick Start

### 1. Navigate to Backend Directory
```bash
cd /Users/nivinfakih/Documents/cle
```

### 2. Build the Project
```bash
./gradlew build
```

### 3. Run the Backend
```bash
./gradlew bootRun
```

The server will start on **http://localhost:8080**

### 4. Verify Installation
Open your browser and go to:
- **Health Check**: http://localhost:8080/actuator/health
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: `password`

## 🏗 Architecture Overview

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Language**: Kotlin
- **Database**: H2 (in-memory) / PostgreSQL (production)
- **Security**: Spring Security + JWT
- **Build Tool**: Gradle

### Key Components

#### 1. Authentication System
- **JWT-based authentication**
- **User registration and login**
- **Google OAuth support (mock implementation)**
- **Role-based access control** (Teacher/Learner)

#### 2. Course Management
- **CRUD operations for courses**
- **Teacher-owned course creation**
- **Multiple availability scheduling**
- **Course search and filtering**

#### 3. Teacher Search
- **Real-time teacher discovery**
- **Skill-based filtering**
- **Price and location filters**
- **Availability-based results**

#### 4. Data Models

```kotlin
// User Entity
User {
    id: String
    email: String
    name: String
    userType: UserType (TEACHER/LEARNER)
    passwordHash: String?
    authProvider: AuthProvider (EMAIL/GOOGLE)
    googleId: String?
    profilePicture: String?
    isVerified: Boolean
    createdAt: LocalDateTime
    updatedAt: LocalDateTime
}

// Course Entity
Course {
    id: String
    teacherId: String
    title: String
    description: String
    skillName: String
    cost: BigDecimal
    duration: Int
    format: SessionFormat (ONLINE/IN_PERSON/HYBRID)
    images: List<String>
    prerequisites: String?
    learningObjectives: List<String>
    isActive: Boolean
    createdAt: LocalDateTime
    updatedAt: LocalDateTime
    availabilities: List<TeacherAvailability>
}

// TeacherAvailability Entity
TeacherAvailability {
    id: String
    teacherId: String
    courseId: String
    courseName: String
    date: LocalDate
    startTime: LocalTime
    endTime: LocalTime
    maxStudents: Int
    location: String?
    virtualMeetingUrl: String?
    isActive: Boolean
    createdAt: LocalDateTime
    updatedAt: LocalDateTime
}
```

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/google` - Google OAuth
- `GET /api/v1/auth/me` - Get current user

### Courses
- `GET /api/v1/courses` - List all courses
- `GET /api/v1/courses/{id}` - Get course by ID
- `POST /api/v1/courses` - Create course (teachers only)
- `PUT /api/v1/courses/{id}` - Update course
- `DELETE /api/v1/courses/{id}` - Delete course

### Availability
- `POST /api/v1/courses/{id}/availabilities` - Add single availability
- `POST /api/v1/courses/{id}/availabilities/multiple` - Add multiple availabilities

### Search
- `POST /api/v1/search/teachers` - Search for teachers
- `GET /api/v1/search/skills` - Get available skills

## 🗄 Database Schema

The backend uses H2 database for development with automatic schema creation. Key tables:

- **users** - User accounts and authentication
- **courses** - Course information and metadata
- **teacher_availability** - Teacher availability slots
- **sessions** - Booked learning sessions (existing)
- **messages** - Session communication (existing)

## 🔧 Configuration

### Application Properties (`application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: password
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true

jwt:
  secret: mySecretKeyForCLEPlatformThatShouldBeAtLeast256BitsLong
  expiration: 3600000 # 1 hour

server:
  port: 8080
```

### Environment Variables (Optional)
```bash
# Database (for production)
export DATABASE_URL=jdbc:postgresql://localhost:5432/cle_db
export DATABASE_USERNAME=cle_user
export DATABASE_PASSWORD=your_password

# JWT
export JWT_SECRET=your-super-secret-key
export JWT_EXPIRATION=3600000

# Email (for notifications)
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

## 📊 Sample Data

The backend automatically initializes with sample data:

### Sample Teachers
1. **Alex Johnson** (alex.johnson@email.com) - Guitar Teacher
2. **Sarah Mitchell** (sarah.mitchell@email.com) - Python Programming
3. **Michael Chen** (michael.chen@email.com) - Spanish Language
4. **Emma Garcia** (emma.garcia@email.com) - Yoga Instructor

### Sample Courses
- **Beginner Guitar Fundamentals** ($50/hour, In-Person)
- **Advanced Guitar Techniques** ($70/90min, In-Person)
- **Python Programming for Beginners** ($75/90min, Online)
- **Spanish Conversation Practice** ($45/hour, Hybrid)
- **Yoga for Beginners** ($40/75min, In-Person)

### Default Credentials
All sample teachers use password: `password123`

## 🧪 Testing the API

### 1. Register a New Teacher
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "userType": "teacher"
  }'
```

### 2. Login and Get Token
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.johnson@email.com",
    "password": "password123",
    "userType": "teacher"
  }'
```

### 3. Search for Teachers
```bash
curl -X POST http://localhost:8080/api/v1/search/teachers \
  -H "Content-Type: application/json" \
  -d '{
    "skill": "Guitar",
    "location": "New York",
    "maxDistance": 25,
    "priceRange": [0, 100],
    "format": "ALL"
  }'
```

### 4. Create a Course (with token)
```bash
curl -X POST http://localhost:8080/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Piano Basics",
    "description": "Learn piano fundamentals",
    "skillName": "Piano",
    "cost": 60.00,
    "duration": 60,
    "format": "IN_PERSON",
    "prerequisites": "None",
    "learningObjectives": ["Basic scales", "Simple songs"]
  }'
```

## 🔄 Connecting Frontend

### 1. Update Frontend API Base URL
In your frontend, update the API base URL to point to the backend:

```typescript
// frontend/src/services/api.ts
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

### 2. Replace DataStore with API Calls
Replace the frontend dataStore with actual API calls:

```typescript
// Example: Replace dataStore.authenticateUser() with API call
const authenticateUser = async (email: string, password: string, userType: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, userType })
  });
  return response.json();
};
```

### 3. Handle JWT Tokens
Store and include JWT tokens in requests:

```typescript
// Store token after login
localStorage.setItem('authToken', response.token);

// Include in API requests
const token = localStorage.getItem('authToken');
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 8080
   lsof -i :8080
   # Kill the process
   kill -9 <PID>
   ```

2. **Java Not Found**
   ```bash
   # Install Java 17
   brew install openjdk@17
   # Set JAVA_HOME
   export JAVA_HOME=$(/usr/libexec/java_home -v 17)
   ```

3. **Database Connection Issues**
   - H2 console: http://localhost:8080/h2-console
   - Check JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`, Password: `password`

4. **CORS Errors**
   - Frontend URLs are whitelisted: `http://localhost:3000`, `http://localhost:3001`
   - Add your frontend URL to CORS configuration if different

### Logs and Debugging
```bash
# Run with debug logging
./gradlew bootRun --debug

# Check application logs
tail -f logs/spring.log
```

## 🏃‍♂️ Next Steps

1. **Start the backend server**
2. **Test API endpoints** using curl or Postman
3. **Update frontend** to use real API endpoints
4. **Test complete flow** from registration to course booking
5. **Deploy to production** (optional)

---

**Need Help?** Check the API documentation at `/swagger-ui.html` when the server is running, or refer to the Swagger specification in `cle-api-swagger.yaml`.