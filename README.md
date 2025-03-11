# MANIS_A.I. Customer Onboarding MVP Documentation

## Project Overview

MANIS_A.I. is an AI-powered customer onboarding platform built with Next.js and Firebase. The application provides a self-service portal for customers to complete onboarding tasks and a dashboard for internal staff to monitor onboarding progress.

## Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **State Management**: TanStack Query (React Query), React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Styling**: Custom Tailwind CSS configuration
- **Animation**: Framer Motion

## Project Structure

```
manis-ai/
├── app/                      # Next.js App Router pages
│   ├── auth/                 # Authentication routes
│   ├── customer/             # Customer portal routes
│   ├── staff/                # Staff dashboard routes
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout with providers
├── components/               # React components
│   ├── auth/                 # Authentication components
│   ├── customer/             # Customer portal components
│   ├── providers/            # Context providers
│   ├── staff/                # Staff dashboard components
│   └── ui/                   # Shared UI components
├── lib/                      # Utility functions and types
│   ├── firebase/             # Firebase integration
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
├── tests/                    # Test scripts
├── .env.example              # Environment variables template
├── DEPLOYMENT.md             # Deployment instructions
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Core Features

### Authentication System

The authentication system provides a simple sign-on mechanism that routes users to the appropriate interface based on their role:

- **Customer Authentication**: Directs users to the customer portal
- **Staff Authentication**: Directs users to the staff dashboard
- **Route Protection**: Prevents unauthorized access to protected routes
- **Persistence**: Maintains user session using localStorage

Key files:
- `/components/providers/auth-provider.tsx`: Context provider for authentication state
- `/lib/hooks/use-auth.ts`: Custom hook for authentication operations
- `/lib/firebase/auth.ts`: Firebase authentication functions

### Customer Portal Interface

The customer portal provides a self-service interface for customers to complete onboarding tasks:

#### Dashboard

- **Progress Tracking**: Visual representation of onboarding progress
- **Action Buttons**: Quick access to key onboarding tasks
- **Status Indicators**: Visual feedback on task completion status

Key files:
- `/app/customer/dashboard/page.tsx`: Dashboard page component
- `/components/customer/dashboard/progress-bar.tsx`: Progress tracking component
- `/components/customer/dashboard/action-buttons.tsx`: Action buttons component
- `/components/customer/dashboard/status-indicators.tsx`: Status indicators component

#### Document Upload

- **Drag-and-Drop Interface**: Easy document uploading
- **Document Checklist**: List of required documents
- **Upload Progress**: Visual feedback during uploads

Key files:
- `/app/customer/documents/page.tsx`: Documents page component
- `/components/customer/document-upload/upload-zone.tsx`: Drag-and-drop upload component
- `/components/customer/document-upload/document-checklist.tsx`: Document checklist component

#### Questionnaire Forms

- **Multi-Step Forms**: Step-by-step data collection
- **Validation**: Form validation using Zod
- **Progress Saving**: Automatic saving of form progress

Key files:
- `/app/customer/forms/page.tsx`: Forms page component
- `/components/customer/forms/questionnaire-form.tsx`: Multi-step form component

#### Call Scheduling

- **Calendar Interface**: Date selection for onboarding calls
- **Time Slot Selection**: Available time slot selection
- **Appointment Management**: Booking and cancellation functionality

Key files:
- `/app/customer/schedule/page.tsx`: Schedule page component
- `/components/customer/scheduling/calendar-picker.tsx`: Calendar component

### Staff Dashboard Interface

The staff dashboard provides an interface for internal staff to monitor and manage customer onboarding:

#### Project Overview

- **Project Cards**: Visual representation of customer projects
- **Filtering**: Filter projects by status
- **Sorting**: Sort projects by various criteria
- **Search**: Search for specific customers

Key files:
- `/app/staff/projects/page.tsx`: Projects page component
- `/components/staff/project-card.tsx`: Project card component
- `/components/staff/project-filters.tsx`: Filtering component
- `/components/staff/project-search.tsx`: Search component
- `/components/staff/sorting-controls.tsx`: Sorting component

#### Project Details

- **Tabbed Interface**: Organized view of project details
- **Timeline**: Chronological view of onboarding activities
- **Document Viewer**: Interface for reviewing uploaded documents
- **Form Responses**: View and review form submissions
- **Notes Section**: Internal communication about projects

Key files:
- `/app/staff/projects/[projectId]/page.tsx`: Project details page component
- `/components/staff/project-details/timeline.tsx`: Timeline component
- `/components/staff/project-details/document-viewer.tsx`: Document viewer component
- `/components/staff/project-details/health-indicator.tsx`: Health indicator component
- `/components/staff/project-details/notes-section.tsx`: Notes component

## Data Management

### Database Schema

The application uses Firebase Firestore for data storage with the following collections:

#### Users

```typescript
interface User {
  id: string;
  email: string;
  userType: 'customer' | 'staff';
  displayName?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

interface CustomerUser extends User {
  userType: 'customer';
  companyName: string;
  companySize?: number;
  industry?: string;
  onboardingProgress: number;
  projectId: string;
  contactDetails: {
    name: string;
    position: string;
    phone?: string;
    email: string;
  };
}

interface StaffUser extends User {
  userType: 'staff';
  role: string;
  department?: string;
  assignedProjects?: string[];
  permissions?: {
    canCreateProjects: boolean;
    canAssignProjects: boolean;
    canViewAllProjects: boolean;
    isAdmin: boolean;
  };
}
```

#### Projects

```typescript
interface Project {
  id: string;
  customerId: string;
  customerName: string;
  companyName: string;
  status: 'On Track' | 'Delayed' | 'Completed';
  progress: number;
  startDate: Timestamp;
  documents: {
    required: string[];
    uploaded: string[];
  };
  forms: {
    required: string[];
    completed: string[];
  };
  callScheduled: Timestamp | null;
  lastUpdated: Timestamp;
  tags?: string[];
  assignedStaffId?: string;
  expectedCompletionDate?: Timestamp;
  phases: OnboardingPhase[];
  activities: ActivityLog[];
  notes: Note[];
}
```

#### Documents

```typescript
interface Document {
  id: string;
  projectId: string;
  customerId: string;
  name: string;
  type: 'id' | 'contract' | 'registration' | 'financial' | 'other';
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  required: boolean;
  uploadedAt?: Timestamp;
  uploadedBy?: string;
  verifiedAt?: Timestamp;
  verifiedBy?: string;
  rejectionReason?: string;
  fileUrl?: string;
  filePath?: string;
  fileType: string;
  fileSize: number;
  metadata?: {
    originalFilename: string;
    contentType: string;
    dimensions?: {
      width: number;
      height: number;
    };
    pageCount?: number;
    tags?: string[];
  };
  version: number;
}
```

#### Forms

```typescript
interface Form {
  id: string;
  projectId: string;
  customerId: string;
  title: string;
  description?: string;
  type: 'company-information' | 'requirements' | 'contact-details' | 'custom';
  status: 'pending' | 'in-progress' | 'completed' | 'reviewed';
  required: boolean;
  fields: FormField[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  completedBy?: string;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  reviewNotes?: string;
  version: number;
  order: number;
}

interface FormResponse {
  id: string;
  formId: string;
  projectId: string;
  customerId: string;
  responses: {
    [fieldId: string]: any;
  };
  submittedAt: Timestamp;
  submittedBy: string;
  formVersion: number;
}
```

#### Appointments

```typescript
interface Appointment {
  id: string;
  projectId: string;
  customerId: string;
  date: Timestamp;
  time: string;
  duration: number;
  type: 'onboarding' | 'follow-up' | 'review';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
}
```

### Data Flow

The application uses a combination of React Context and Firebase services for data management:

1. **Context Providers**: Provide data and operations to components
   - `AuthProvider`: Authentication state and operations
   - `ProjectsProvider`: Project data and operations
   - `DocumentsProvider`: Document data and operations
   - `FormsProvider`: Form data and operations
   - `SchedulingProvider`: Appointment data and operations

2. **Firebase Services**: Handle data storage and retrieval
   - `auth.ts`: Authentication operations
   - `projects.ts`: Project CRUD operations
   - `documents.ts`: Document upload and management
   - `forms.ts`: Form submission and retrieval
   - `scheduling.ts`: Appointment booking and management

3. **Data Flow Pattern**:
   - UI components use context hooks to access data and operations
   - Context providers handle state management and API calls
   - Firebase services handle data persistence and retrieval
   - Changes in data trigger UI updates through context

## Styling and Theming

The application uses Tailwind CSS with custom configuration for consistent styling:

- **Global CSS**: Custom variables for colors, spacing, and typography
- **Tailwind Config**: Extended theme with custom colors and components
- **Utility Functions**: Helper functions for consistent styling

Key files:
- `/app/globals.css`: Global styles and variables
- `/tailwind.config.js`: Tailwind configuration
- `/lib/utils.ts`: Styling utility functions

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your Firebase configuration
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Future Enhancements

- **Advanced Authentication**: Integration with Firebase Authentication
- **Real-time Updates**: Implement WebSocket or Firebase real-time listeners
- **AI-powered Recommendations**: Add AI suggestions for onboarding optimization
- **Analytics Dashboard**: Add analytics for onboarding performance metrics
- **Mobile Applications**: Develop native mobile apps for iOS and Android
- **Integration APIs**: Create APIs for integration with other systems
