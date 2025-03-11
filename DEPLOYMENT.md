# MANIS_A.I. Deployment Guide

This document provides instructions for deploying the MANIS_A.I. customer onboarding MVP.

## Prerequisites

- Node.js 18+ and npm
- Firebase account with Firestore, Authentication, and Storage enabled
- Vercel account (recommended for deployment)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application Settings
NEXT_PUBLIC_APP_URL=your_app_url
```

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## Deployment to Vercel

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the application:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

## Firebase Security Rules

Add the following security rules to your Firebase project:

### Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects rules
    match /projects/{projectId} {
      // Customers can only read their own projects
      allow read: if request.auth != null && 
                   (resource.data.customerId == request.auth.uid || 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'staff');
      
      // Only staff can create and update projects
      allow create, update: if request.auth != null && 
                             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'staff';
    }
    
    // Documents rules
    match /documents/{documentId} {
      // Customers can read and create documents for their projects
      allow read, create: if request.auth != null && 
                           (resource.data.customerId == request.auth.uid || 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'staff');
      
      // Only staff can update document status
      allow update: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'staff';
    }
    
    // Forms rules
    match /forms/{formId} {
      // Both customers and staff can read forms
      allow read: if request.auth != null;
      
      // Only staff can create and update forms
      allow create, update: if request.auth != null && 
                             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'staff';
    }
    
    // Form responses rules
    match /form_responses/{responseId} {
      // Customers can create responses and read their own responses
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
                   (resource.data.customerId == request.auth.uid || 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'staff');
    }
    
    // Appointments rules
    match /appointments/{appointmentId} {
      // Customers can read and create appointments for their projects
      allow read, create: if request.auth != null && 
                           (resource.data.customerId == request.auth.uid || 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'staff');
      
      // Both customers and staff can update appointments
      allow update: if request.auth != null;
    }
  }
}
```

### Storage Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{projectId}/{allPaths=**} {
      // Customers can upload documents to their own projects
      allow read, write: if request.auth != null && 
                          (request.resource.metadata.customerId == request.auth.uid || 
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'staff');
    }
  }
}
```

## Post-Deployment Verification

After deployment, verify the following:

1. Authentication flow works correctly
2. Customer portal features are accessible
3. Staff dashboard displays project information
4. Document upload and form submission work as expected
5. Scheduling functionality operates correctly

## Troubleshooting

- **Authentication Issues**: Verify Firebase Authentication is properly configured
- **Storage Access Problems**: Check Firebase Storage rules and CORS configuration
- **API Errors**: Ensure environment variables are correctly set
- **Styling Issues**: Clear browser cache and verify CSS is loading properly
