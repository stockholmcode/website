# CLE Platform API Testing Guide

This guide provides comprehensive testing instructions for the Community Learning Exchange (CLE) platform API.

## 📋 Overview

The CLE platform connects learners with teachers through courses and availability management. The API provides endpoints for:

- **Authentication**: User registration and login (email/password + Google OAuth)
- **User Management**: Profile management
- **Course Management**: Teachers create and manage courses
- **Availability Management**: Teachers set available time slots
- **Search**: Learners find teachers and courses
- **Session Management**: Booking and managing learning sessions
- **Messaging**: Communication between teachers and learners

## 🚀 Quick Start

### 1. View API Documentation

Open the Swagger UI to explore all endpoints:

```bash
# Navigate to the CLE directory
cd /Users/nivinfakih/Documents/cle

# Start a simple HTTP server (Python 3)
python3 -m http.server 8000

# Or using Node.js
npx http-server . -p 8000

# Then open in browser:
# http://localhost:8000/swagger-ui.html
```

### 2. Base URL

For testing, assume the API is running at:
```
http://localhost:8080/api/v1
```

## 🧪 Test Scenarios

### Scenario 1: Complete Teacher Flow

#### 1.1 Teacher Registration
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alex",
    "lastName": "Johnson",
    "email": "alex.johnson@email.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "userType": "teacher"
  }'
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "teacher-1",
    "email": "alex.johnson@email.com",
    "name": "Alex Johnson",
    "userType": "teacher",
    "authProvider": "email",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "expiresIn": 3600
}
```

#### 1.2 Create Course
```bash
curl -X POST http://localhost:8080/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Beginner Guitar Fundamentals",
    "description": "Learn the basics of guitar playing including chords, strumming patterns, and simple songs. Perfect for complete beginners.",
    "skillName": "Guitar",
    "cost": 50,
    "duration": 60,
    "format": "IN_PERSON",
    "prerequisites": "No experience required",
    "learningObjectives": [
      "Master basic chord shapes (G, C, D, Em)",
      "Learn proper strumming techniques",
      "Play 3 simple songs"
    ]
  }'
```

#### 1.3 Add Availability
```bash
curl -X POST http://localhost:8080/api/v1/courses/COURSE_ID/availabilities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2024-02-15",
    "startTime": "10:00",
    "endTime": "11:00",
    "maxStudents": 3,
    "location": "123 Music Studio, Room A"
  }'
```

### Scenario 2: Complete Learner Flow

#### 2.1 Learner Registration
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Emma",
    "lastName": "Smith",
    "email": "emma.smith@email.com",
    "password": "LearnerPass123",
    "confirmPassword": "LearnerPass123",
    "userType": "learner"
  }'
```

#### 2.2 Search for Teachers
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

Expected Response:
```json
{
  "results": [
    {
      "id": "teacher-1",
      "name": "Alex Johnson",
      "email": "alex.johnson@email.com",
      "skill": "Guitar",
      "price": 50,
      "rating": 4.8,
      "distance": 5.2,
      "format": ["IN_PERSON"],
      "location": "123 Music Studio, Room A",
      "experience": "5 years",
      "course": {
        "id": "course-123",
        "title": "Beginner Guitar Fundamentals",
        "description": "Learn the basics...",
        "duration": 60
      },
      "availabilities": [
        {
          "id": "avail-123",
          "date": "2024-02-15",
          "startTime": "10:00",
          "endTime": "11:00",
          "maxStudents": 3,
          "location": "123 Music Studio, Room A"
        }
      ]
    }
  ],
  "totalCount": 1,
  "page": 1,
  "limit": 10
}
```

#### 2.3 Book a Session
```bash
curl -X POST http://localhost:8080/api/v1/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer LEARNER_TOKEN_HERE" \
  -d '{
    "teacherId": "teacher-1",
    "courseId": "course-123",
    "availabilityId": "avail-123",
    "startTime": "2024-02-15T10:00:00Z",
    "endTime": "2024-02-15T11:00:00Z",
    "learnerGoals": "Learn basic chords",
    "preparationNotes": "I have a guitar but no experience"
  }'
```

### Scenario 3: Authentication Testing

#### 3.1 Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alex.johnson@email.com",
    "password": "SecurePass123",
    "userType": "teacher"
  }'
```

#### 3.2 Google OAuth (Mock)
```bash
curl -X POST http://localhost:8080/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "googleToken": "mock_google_token_123",
    "userType": "learner"
  }'
```

#### 3.3 Get Current User Profile
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Scenario 4: Course Management

#### 4.1 Get All Courses
```bash
curl -X GET "http://localhost:8080/api/v1/courses?skill=Guitar&isActive=true"
```

#### 4.2 Get Teacher's Courses
```bash
curl -X GET "http://localhost:8080/api/v1/courses?teacherId=teacher-1" \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE"
```

#### 4.3 Update Course
```bash
curl -X PUT http://localhost:8080/api/v1/courses/course-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE" \
  -d '{
    "title": "Advanced Guitar Fundamentals",
    "description": "Updated description with more advanced techniques",
    "cost": 75
  }'
```

#### 4.4 Delete Course
```bash
curl -X DELETE http://localhost:8080/api/v1/courses/course-123 \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE"
```

### Scenario 5: Session Management

#### 5.1 Get User Sessions
```bash
curl -X GET "http://localhost:8080/api/v1/sessions?status=CONFIRMED&startDate=2024-02-01" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 5.2 Update Session Status
```bash
curl -X PATCH http://localhost:8080/api/v1/sessions/session-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEACHER_TOKEN_HERE" \
  -d '{
    "status": "COMPLETED",
    "sessionNotes": "Student learned basic chords successfully"
  }'
```

#### 5.3 Cancel Session
```bash
curl -X PATCH http://localhost:8080/api/v1/sessions/session-123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "CANCELLED",
    "cancellationReason": "Student scheduling conflict"
  }'
```

### Scenario 6: Messaging

#### 6.1 Get Session Messages
```bash
curl -X GET "http://localhost:8080/api/v1/sessions/session-123/messages?limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 6.2 Send Message
```bash
curl -X POST http://localhost:8080/api/v1/sessions/session-123/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "content": "Looking forward to our guitar lesson!",
    "type": "TEXT"
  }'
```

## 🎯 Test Data Examples

### Sample Teachers
- **Alex Johnson** (alex.johnson@email.com) - Guitar Teacher
- **Sarah Mitchell** (sarah.mitchell@email.com) - Python Programming  
- **Michael Chen** (michael.chen@email.com) - Spanish Language
- **Emma Garcia** (emma.garcia@email.com) - Yoga Instructor

### Sample Courses
- **Beginner Guitar Fundamentals** - $50/hour, In-Person
- **Python Programming for Beginners** - $75/90min, Online
- **Spanish Conversation Practice** - $45/hour, Hybrid
- **Yoga for Beginners** - $40/75min, In-Person

### Sample Skills
- Music: Guitar, Piano, Violin, Drums
- Technology: Python Programming, JavaScript, Web Development
- Languages: Spanish, French, German, Italian
- Fitness: Yoga, Personal Training, Pilates
- Academic: Mathematics, Physics, Chemistry

## 🔍 Error Scenarios to Test

### Authentication Errors
```bash
# Invalid credentials
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "wrongpassword",
    "userType": "teacher"
  }'

# Missing authorization
curl -X GET http://localhost:8080/api/v1/users/me

# Invalid token
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer invalid_token"
```

### Validation Errors
```bash
# Duplicate email registration
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "alex.johnson@email.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123",
    "userType": "learner"
  }'

# Invalid course data
curl -X POST http://localhost:8080/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEACHER_TOKEN" \
  -d '{
    "title": "",
    "cost": -10,
    "duration": 0
  }'
```

### Authorization Errors
```bash
# Learner trying to create course
curl -X POST http://localhost:8080/api/v1/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer LEARNER_TOKEN" \
  -d '{
    "title": "Unauthorized Course",
    "description": "This should fail",
    "skillName": "Guitar",
    "cost": 50,
    "duration": 60,
    "format": "IN_PERSON"
  }'

# Teacher trying to access another teacher's course
curl -X PUT http://localhost:8080/api/v1/courses/other-teacher-course-id \
  -H "Authorization: Bearer TEACHER_TOKEN" \
  -d '{
    "title": "Hacking attempt"
  }'
```

## 📊 Expected Response Formats

### Success Responses
- **200 OK**: Resource retrieved successfully
- **201 Created**: Resource created successfully  
- **204 No Content**: Resource deleted successfully

### Error Responses
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists

### Standard Error Format
```json
{
  "error": "Validation Error",
  "message": "Email already exists",
  "code": "USER_EMAIL_EXISTS",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🛠 Testing Tools

### Recommended Tools
1. **Swagger UI**: Interactive API documentation
2. **Postman**: API testing with collections
3. **curl**: Command-line testing
4. **Insomnia**: Alternative to Postman
5. **HTTPie**: User-friendly curl alternative

### Environment Setup
Create a `.env` file for testing:
```
API_BASE_URL=http://localhost:8080/api/v1
TEACHER_EMAIL=alex.johnson@email.com
TEACHER_PASSWORD=SecurePass123
LEARNER_EMAIL=emma.smith@email.com
LEARNER_PASSWORD=LearnerPass123
```

## 🎉 Validation Checklist

- [ ] Teacher can register and login
- [ ] Learner can register and login
- [ ] Google OAuth flow works
- [ ] Teacher can create courses
- [ ] Teacher can add availability
- [ ] Learner can search teachers
- [ ] Search results match course data
- [ ] Learner can book sessions
- [ ] Session status updates work
- [ ] Messaging between users works
- [ ] Authorization prevents unauthorized access
- [ ] Error handling works correctly
- [ ] Data validation prevents invalid inputs

## 📞 Support

For questions about the API or testing:
- Email: support@cle-platform.com
- Documentation: http://localhost:8000/swagger-ui.html
- GitHub Issues: [Report bugs and request features]

---

**Note**: This API specification represents the ideal backend for the CLE platform. The current frontend implementation uses an in-memory dataStore that simulates these API endpoints.