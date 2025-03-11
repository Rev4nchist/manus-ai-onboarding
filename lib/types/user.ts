// lib/types/user.ts - Enhanced with additional fields for database schema

import { Timestamp } from 'firebase/firestore';

export type UserType = 'customer' | 'staff';

export interface User {
  id: string;
  email: string;
  userType: UserType;
  displayName?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface CustomerUser extends User {
  userType: 'customer';
  companyName: string;
  companySize?: number;
  industry?: string;
  onboardingProgress: number;
  projectId: string; // Reference to associated project
  contactDetails: {
    name: string;
    position: string;
    phone?: string;
    email: string;
  };
  preferences?: {
    notifications: boolean;
    communicationChannel: 'email' | 'phone' | 'both';
  };
}

export interface StaffUser extends User {
  userType: 'staff';
  role: string;
  department?: string;
  assignedProjects?: string[]; // Array of project IDs
  permissions?: {
    canCreateProjects: boolean;
    canAssignProjects: boolean;
    canViewAllProjects: boolean;
    isAdmin: boolean;
  };
}
