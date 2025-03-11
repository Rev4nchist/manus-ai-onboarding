// lib/types/form.ts - Form schema for the database

import { Timestamp } from 'firebase/firestore';

export type FormStatus = 'pending' | 'in-progress' | 'completed' | 'reviewed';
export type FormType = 'company-information' | 'requirements' | 'contact-details' | 'custom';

export interface Form {
  id: string;
  projectId: string;
  customerId: string;
  title: string;
  description?: string;
  type: FormType;
  status: FormStatus;
  required: boolean;
  fields: FormField[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  completedBy?: string;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  reviewNotes?: string;
  version: number; // For tracking form versions
  order: number; // For ordering forms in multi-step processes
}

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'date' 
  | 'select' 
  | 'multiselect' 
  | 'radio' 
  | 'checkbox' 
  | 'file';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[]; // For select, multiselect, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    customValidation?: string; // For custom validation logic
  };
  order: number;
  conditional?: {
    dependsOn: string; // Field ID this field depends on
    showWhen: any; // Value that triggers showing this field
  };
}

export interface FormResponse {
  id: string;
  formId: string;
  projectId: string;
  customerId: string;
  responses: {
    [fieldId: string]: any; // Field ID to response value mapping
  };
  submittedAt: Timestamp;
  submittedBy: string;
  lastSaved?: Timestamp;
  formVersion: number; // To track which version of the form was filled
}

export interface FormTemplate {
  id: string;
  title: string;
  description?: string;
  type: FormType;
  fields: FormField[];
  isDefault: boolean;
  createdAt: Timestamp;
  createdBy: string;
  version: number;
}
