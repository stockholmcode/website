# CLE Session Booking Frontend

React TypeScript frontend for the Community Learning Exchange Session Booking platform.

## Features

- **Session Booking**: Interactive form to book learning sessions
- **Session Management**: View, confirm, cancel, and reschedule sessions
- **User Roles**: Support for both teachers and learners
- **Responsive Design**: Mobile-friendly interface
- **Real-time Validation**: Form validation with error handling
- **API Integration**: Seamless connection to Spring Boot backend

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on http://localhost:8080

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The app will open at http://localhost:3000

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Main navigation
│   ├── SessionBookingForm.tsx
│   └── SessionList.tsx
├── services/           # API services
│   └── api.ts         # Backend API integration
├── types/             # TypeScript definitions
│   └── session.ts     # Session-related types
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## Usage

### As a Teacher
1. Enter your teacher ID and select "Continue as Teacher"
2. Book sessions by filling out the booking form
3. View your teaching sessions in "My Sessions"
4. Confirm or cancel pending sessions

### As a Learner
1. Enter your learner ID and select "Continue as Learner"
2. Book sessions with available teachers
3. View your learning sessions in "My Sessions"
4. Cancel confirmed sessions if needed

## API Integration

The frontend communicates with the Spring Boot backend through:
- Session booking and management endpoints
- Teacher availability endpoints
- Health check endpoint

API base URL is configurable via `REACT_APP_API_URL` environment variable.

## Technology Stack

- **React 18** with TypeScript
- **Styled Components** for styling
- **React Hook Form** for form handling
- **Axios** for API requests
- **date-fns** for date formatting
- **React Router** for navigation (ready for future routing needs)