# MANIS_A.I. Customer Onboarding MVP Demo Guide

This document provides a guide for demonstrating the MANIS_A.I. customer onboarding MVP.

## Demo Setup

### Prerequisites

- Node.js 18+ and npm
- Firebase account with Firestore, Authentication, and Storage enabled
- Local environment setup as described in README.md

### Sample Data

Before starting the demo, ensure the following sample data is loaded:

1. **Customer Users**:
   - Email: customer@example.com (Customer role)
   - Email: staff@example.com (Staff role)

2. **Projects**:
   - Acme Corporation (On Track - 75% complete)
   - TechStart Solutions (Delayed - 30% complete)
   - Global Enterprises (Completed - 100% complete)

3. **Documents**:
   - Sample contract.pdf
   - Sample id.jpg
   - Sample registration.pdf

4. **Forms**:
   - Company Information Form (completed for Acme)
   - Requirements Form (completed for Acme)

5. **Appointments**:
   - Scheduled onboarding call for Acme Corporation

## Demo Flow

### 1. Introduction (2 minutes)

- Introduce MANIS_A.I. as an AI-powered customer onboarding platform
- Explain the problem it solves: streamlining customer onboarding
- Highlight the key features: self-service portal and staff dashboard

### 2. Authentication (1 minute)

- Navigate to the sign-in page
- Demonstrate the simple sign-on router
- Show how users are directed to different interfaces based on role

### 3. Customer Portal (5 minutes)

#### Dashboard

- Sign in as a customer (customer@example.com)
- Show the dashboard with progress tracking
- Explain the action buttons and status indicators
- Demonstrate how the dashboard provides an overview of onboarding status

#### Document Upload

- Navigate to the documents page
- Demonstrate the drag-and-drop upload functionality
- Show the document checklist and upload progress
- Upload a sample document

#### Questionnaire Forms

- Navigate to the forms page
- Show the multi-step form with validation
- Demonstrate form submission and progress saving
- Complete a sample form

#### Call Scheduling

- Navigate to the scheduling page
- Demonstrate the calendar interface and time slot selection
- Book an appointment
- Show the confirmation and cancellation options

### 4. Staff Dashboard (5 minutes)

#### Project Overview

- Sign out and sign in as staff (staff@example.com)
- Show the projects overview with project cards
- Demonstrate filtering, sorting, and search functionality
- Explain how staff can quickly find and monitor projects

#### Project Details

- Click on a project to view details
- Show the tabbed interface (Overview, Documents, Forms, Notes)
- Demonstrate the timeline of onboarding activities
- Show the document viewer for reviewing uploaded documents
- Demonstrate the form responses viewer
- Add a note to the project

### 5. Technical Architecture (3 minutes)

- Explain the Next.js and Firebase architecture
- Highlight the TypeScript implementation for type safety
- Demonstrate the responsive design with Tailwind CSS
- Explain the data flow between components and Firebase

### 6. AI Integration Points (2 minutes)

- Explain current and future AI integration points:
  - Document verification and analysis
  - Form completion suggestions
  - Onboarding optimization recommendations
  - Customer support chatbot integration

### 7. Deployment and Scaling (2 minutes)

- Explain the deployment options (Vercel, Firebase Hosting)
- Discuss scaling considerations for enterprise use
- Highlight security measures implemented

### 8. Q&A (5 minutes)

- Address questions about functionality, implementation, or future plans

## Key Talking Points

### Value Proposition

- Reduces onboarding time by 60% through self-service
- Improves customer experience with clear progress tracking
- Increases staff efficiency by centralizing onboarding information
- Reduces errors through validation and AI-assisted verification

### Technical Excellence

- Modern tech stack with Next.js 14 and TypeScript
- Scalable architecture with Firebase backend
- Clean, maintainable code with proper separation of concerns
- Comprehensive testing and documentation

### Future Roadmap

- Advanced AI features for document analysis
- Integration with CRM and ERP systems
- Mobile applications for on-the-go access
- Analytics dashboard for onboarding performance metrics

## Demo Tips

- Ensure all sample data is loaded before starting
- Practice the flow to ensure smooth transitions
- Have backup plans for potential technical issues
- Focus on business value, not just technical features
- Highlight how the MVP addresses the core requirements
- Be prepared to explain design decisions and trade-offs
