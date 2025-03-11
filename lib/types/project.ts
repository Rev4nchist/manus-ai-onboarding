// lib/types/project.ts - Enhanced with additional fields for database schema

import { Timestamp } from 'firebase/firestore';

export type ProjectStatus = 'On Track' | 'Delayed' | 'Completed';

export interface Project {
  id: string;
  customerId: string;
  customerName: string;
  companyName: string;
  status: ProjectStatus;
  progress: number; // Percentage complete
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
  
  // Additional fields for database schema
  assignedStaffId?: string;
  expectedCompletionDate?: Timestamp;
  phases: OnboardingPhase[];
  activities: ActivityLog[];
  notes: Note[];
  settings?: {
    priorityLevel: 'low' | 'medium' | 'high';
    automatedReminders: boolean;
    customRequirements?: string[];
  };
}

export interface OnboardingPhase {
  id: string;
  name: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startDate?: Timestamp;
  completionDate?: Timestamp;
  tasks: OnboardingTask[];
  order: number;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate?: Timestamp;
  type: 'document' | 'form' | 'call' | 'other';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  completedBy?: string;
  completedAt?: Timestamp;
}

export interface ActivityLog {
  id: string;
  timestamp: Timestamp;
  type: 'document' | 'form' | 'call' | 'status' | 'note';
  description: string;
  performedBy: string;
  performedByType: 'customer' | 'staff' | 'system';
  relatedEntityId?: string; // ID of related document, form, etc.
}

export interface Note {
  id: string;
  content: string;
  createdAt: Timestamp;
  createdBy: string;
  createdByType: 'customer' | 'staff';
  isInternal: boolean; // Whether visible to customers or staff-only
}
