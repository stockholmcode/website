# CLE Session Booking Service

A Kotlin Spring Boot microservice for handling session booking functionality in the Community Learning Exchange platform.

## Features

This service implements the backend requirements for **CLE-009-BE: Session Booking - Backend**:

### ✅ Implemented Features

- **Session booking API with availability validation**
  - POST `/api/v1/sessions` - Book a new session
  - Validates teacher availability and prevents double-booking

- **Calendar integration APIs** (Structure ready for Google, Outlook)
  - Availability checking framework
  - Ready for external calendar API integration

- **Session data model and database schema**
  - Complete Session entity with all required fields
  - TeacherAvailability entity for managing schedules
  - JPA repositories with custom queries

- **Booking conflict detection and resolution**
  - Automatic conflict checking before booking
  - Prevents overlapping sessions for teachers

- **Cancellation and rescheduling logic**
  - PUT `/api/v1/sessions/{id}/cancel` - Cancel with reason
  - PUT `/api/v1/sessions/{id}/reschedule` - Reschedule sessions
  - State validation to ensure only valid operations

- **Email notification service for bookings**
  - Booking confirmations for learners and teachers
  - Cancellation and reschedule notifications
  - Session completion notifications

- **Payment processing integration** (Structure ready)
  - Price field in session model
  - Ready for payment gateway integration

- **Session state management**
  - Complete session lifecycle: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
  - Support for CANCELLED and NO_SHOW states

- **Teacher availability management system**
  - GET/POST/PUT/DELETE `/api/v1/availability` endpoints
  - Day-of-week based availability slots
  - Active/inactive availability management

- **Booking analytics and reporting** (Basic structure)
  - User session history endpoints
  - Database structure supports reporting queries

## API Endpoints

### Session Management
```
POST   /api/v1/sessions                    # Book a session
GET    /api/v1/sessions/{id}               # Get session details
GET    /api/v1/sessions/user/{userId}      # Get user's sessions
PUT    /api/v1/sessions/{id}/confirm       # Confirm session
PUT    /api/v1/sessions/{id}/cancel        # Cancel session
PUT    /api/v1/sessions/{id}/reschedule    # Reschedule session
PUT    /api/v1/sessions/{id}/complete      # Mark completed
```

### Availability Management
```
GET    /api/v1/availability/teacher/{id}   # Get teacher availability
POST   /api/v1/availability               # Add availability slot
PUT    /api/v1/availability/{id}          # Update availability
DELETE /api/v1/availability/{id}          # Remove availability
```

## Technology Stack

- **Kotlin** - Primary language
- **Spring Boot 3.2.0** - Framework
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database (development)
- **PostgreSQL** - Production database support
- **Spring Mail** - Email notifications
- **Spring Validation** - Request validation
- **JUnit 5 & Mockito** - Testing

## Getting Started

### Prerequisites
- Java 17 or higher (if running locally)
- Docker (alternative to Java)

### Running the Application

#### Option 1: With Java (Recommended)
1. **Install Java 17+**
   ```bash
   # macOS with Homebrew
   brew install openjdk@17
   
   # Or download from: https://adoptium.net/
   ```

2. **Run the application**
   ```bash
   cd /Users/nivinfakih/Documents/cle
   chmod +x gradlew
   ./gradlew bootRun
   ```

#### Option 2: With Docker
1. **Single container**
   ```bash
   cd /Users/nivinfakih/Documents/cle
   docker build -t session-booking .
   docker run -p 8080:8080 session-booking
   ```

2. **With PostgreSQL (production-like)**
   ```bash
   cd /Users/nivinfakih/Documents/cle
   docker-compose up --build
   ```

#### Option 3: Quick Start Script
```bash
cd /Users/nivinfakih/Documents/cle
./run.sh
```
*Automatically detects Java/Docker and runs accordingly*

**✅ Gradle Wrapper Ready:** The `./gradlew` command is now properly configured and ready to use once Java is installed.

#### Option 4: IDE (IntelliJ IDEA/Eclipse)
1. **Import as Gradle project**
2. **Run SessionBookingApplication.kt**

### Access the Application
- API Base URL: `http://localhost:8080/api/v1`
- H2 Console: `http://localhost:8080/h2-console`
- Health Check: `http://localhost:8080/actuator/health`

### Testing

```bash
# Run all tests
./gradlew test

# Run with coverage
./gradlew test jacocoTestReport
```

### Configuration

The application uses `application.yml` for configuration:

- **Database**: H2 in-memory (development), PostgreSQL support
- **Mail**: SMTP configuration for notifications
- **Server**: Runs on port 8080
- **CORS**: Enabled for `http://localhost:3000` (frontend)

## Database Schema

### Sessions Table
- Session management with all booking details
- Support for virtual and in-person sessions
- Complete audit trail with timestamps

### Teacher Availability Table
- Day-of-week based availability slots
- Time range support
- Active/inactive states

## Error Handling

Comprehensive error handling with:
- Custom exceptions for business logic
- Global exception handler
- Structured error responses
- Validation error details

## Example Usage

### Book a Session
```bash
curl -X POST http://localhost:8080/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "teacherId": "123e4567-e89b-12d3-a456-426614174000",
    "learnerId": "123e4567-e89b-12d3-a456-426614174001",
    "skillName": "Kotlin Programming",
    "startTime": "2024-01-15T10:00:00",
    "endTime": "2024-01-15T11:00:00",
    "format": "VIRTUAL",
    "virtualMeetingUrl": "https://meet.google.com/abc-defg-hij",
    "price": 50.00,
    "learnerGoals": "Learn Kotlin basics"
  }'
```

## Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Real-time notifications (WebSockets)
- Calendar synchronization (Google Calendar, Outlook)
- Advanced analytics and reporting
- Rate limiting and API security
- Session recording support
- Multi-language email templates

## Development Notes

This implementation follows Spring Boot best practices:
- Clean architecture with separate layers
- Comprehensive validation
- Proper exception handling
- Testable service design
- RESTful API design
- Database migration ready structure

The service is designed to be production-ready and scalable, with clear separation of concerns and comprehensive error handling.