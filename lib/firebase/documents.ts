// lib/firebase/documents.ts - CRUD operations for documents

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';
import { Document, DocumentStatus, DocumentType } from '@/lib/types/document';
import { updateProjectProgress } from './projects';

const DOCUMENTS_COLLECTION = 'documents';
const STORAGE_PATH = 'documents';

// Upload a document file and create document record
export const uploadDocument = async (
  file: File,
  projectId: string,
  customerId: string,
  documentType: DocumentType,
  required: boolean,
  uploadedBy: string
): Promise<Document> => {
  try {
    // Create a unique file path
    const timestamp = Date.now();
    const filePath = `${STORAGE_PATH}/${projectId}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, filePath);
    
    // Upload file to Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Wait for upload to complete
    const snapshot = await new Promise<any>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress monitoring could be implemented here
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve(uploadTask.snapshot);
        }
      );
    });
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Create document record in Firestore
    const documentRef = doc(collection(db, DOCUMENTS_COLLECTION));
    
    const newDocument: Document = {
      id: documentRef.id,
      projectId,
      customerId,
      name: file.name,
      type: documentType,
      status: 'uploaded',
      required,
      uploadedAt: Timestamp.now(),
      uploadedBy,
      fileUrl: downloadURL,
      filePath,
      fileType: file.type,
      fileSize: file.size,
      metadata: {
        originalFilename: file.name,
        contentType: file.type
      },
      version: 1
    };
    
    await setDoc(documentRef, newDocument);
    
    // Update project progress
    await updateProjectDocumentStatus(projectId, documentType, 'uploaded', uploadedBy);
    
    return newDocument;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// Get a document by ID
export const getDocument = async (documentId: string): Promise<Document | null> => {
  try {
    const documentRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    const documentSnap = await getDoc(documentRef);
    
    if (documentSnap.exists()) {
      return { id: documentSnap.id, ...documentSnap.data() } as Document;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// Update document status
export const updateDocumentStatus = async (
  documentId: string,
  status: DocumentStatus,
  updatedBy: string
): Promise<Document> => {
  try {
    const documentRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    const documentSnap = await getDoc(documentRef);
    
    if (!documentSnap.exists()) {
      throw new Error('Document not found');
    }
    
    const document = { id: documentSnap.id, ...documentSnap.data() } as Document;
    
    // Update fields based on status
    const updateData: any = { status };
    
    if (status === 'verified') {
      updateData.verifiedAt = Timestamp.now();
      updateData.verifiedBy = updatedBy;
    } else if (status === 'rejected') {
      updateData.rejectionReason = 'Document requires revision'; // Default reason
    }
    
    // Update the document
    await updateDoc(documentRef, updateData);
    
    // Update project progress
    await updateProjectDocumentStatus(document.projectId, document.type, status, updatedBy);
    
    // Get the updated document
    const updatedDocument = await getDocument(documentId);
    if (!updatedDocument) {
      throw new Error('Document not found after update');
    }
    
    return updatedDocument;
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    // Get document data first to get the storage path
    const document = await getDocument(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Delete file from storage if it exists
    if (document.filePath) {
      const storageRef = ref(storage, document.filePath);
      await deleteObject(storageRef);
    }
    
    // Delete document record from Firestore
    const documentRef = doc(db, DOCUMENTS_COLLECTION, documentId);
    await deleteDoc(documentRef);
    
    // Update project progress
    await updateProjectDocumentStatus(document.projectId, document.type, 'pending', 'system');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Get documents by project ID
export const getDocumentsByProject = async (projectId: string): Promise<Document[]> => {
  try {
    const documentsRef = collection(db, DOCUMENTS_COLLECTION);
    const q = query(documentsRef, where('projectId', '==', projectId));
    const documentsSnap = await getDocs(q);
    
    return documentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Document[];
  } catch (error) {
    console.error('Error getting documents by project:', error);
    throw error;
  }
};

// Get documents by customer ID
export const getDocumentsByCustomer = async (customerId: string): Promise<Document[]> => {
  try {
    const documentsRef = collection(db, DOCUMENTS_COLLECTION);
    const q = query(documentsRef, where('customerId', '==', customerId));
    const documentsSnap = await getDocs(q);
    
    return documentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Document[];
  } catch (error) {
    console.error('Error getting documents by customer:', error);
    throw error;
  }
};

// Helper function to update project document status and progress
const updateProjectDocumentStatus = async (
  projectId: string,
  documentType: DocumentType,
  status: DocumentStatus,
  performedBy: string
): Promise<void> => {
  try {
    // Get all documents for this project
    const documents = await getDocumentsByProject(projectId);
    
    // Calculate progress based on required documents
    const requiredDocs = documents.filter(doc => doc.required);
    const uploadedRequiredDocs = requiredDocs.filter(doc => 
      doc.status === 'uploaded' || doc.status === 'verified'
    );
    
    // Calculate progress percentage
    const progress = requiredDocs.length > 0 
      ? Math.round((uploadedRequiredDocs.length / requiredDocs.length) * 100)
      : 0;
    
    // Update project progress
    await updateProjectProgress(
      projectId,
      progress,
      performedBy,
      performedBy === 'system' ? 'system' : 'staff'
    );
  } catch (error) {
    console.error('Error updating project document status:', error);
    throw error;
  }
};
