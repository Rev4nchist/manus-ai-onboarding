// lib/types/document.ts - Document schema for the database

import { Timestamp } from 'firebase/firestore';

export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';
export type DocumentType = 'id' | 'contract' | 'registration' | 'financial' | 'other';

export interface Document {
  id: string;
  projectId: string;
  customerId: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  required: boolean;
  uploadedAt?: Timestamp;
  uploadedBy?: string;
  verifiedAt?: Timestamp;
  verifiedBy?: string;
  rejectionReason?: string;
  fileUrl?: string;
  filePath?: string;
  fileType: string; // MIME type
  fileSize: number; // in bytes
  metadata?: {
    originalFilename: string;
    contentType: string;
    dimensions?: {
      width: number;
      height: number;
    };
    pageCount?: number; // For PDFs
    tags?: string[];
  };
  notes?: string;
  expiryDate?: Timestamp; // For documents that expire (e.g., licenses)
  version: number; // For tracking document versions
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  description: string;
  required: boolean;
  fileUrl?: string; // Template file URL if applicable
  instructions?: string;
  acceptedFileTypes: string[]; // Array of accepted MIME types
  maxFileSize: number; // Maximum file size in bytes
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
  documentTypes: DocumentType[];
  order: number;
}
