'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from './auth-provider';
import { 
  uploadDocument,
  getDocument,
  getDocumentsByProject,
  getDocumentsByCustomer,
  updateDocumentStatus,
  deleteDocument
} from '@/lib/firebase/documents';
import { Document, DocumentStatus, DocumentType } from '@/lib/types/document';

interface DocumentsContextType {
  documents: Document[];
  loading: boolean;
  error: Error | null;
  uploadingFiles: { [key: string]: { progress: number, name: string } };
  refreshDocuments: (projectId?: string) => Promise<void>;
  getDocumentById: (id: string) => Promise<Document | null>;
  uploadFile: (file: File, projectId: string, documentType: DocumentType, required: boolean) => Promise<void>;
  updateStatus: (documentId: string, status: DocumentStatus) => Promise<void>;
  deleteFile: (documentId: string) => Promise<void>;
}

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export function DocumentsProvider({ 
  children,
  projectId 
}: { 
  children: ReactNode;
  projectId?: string;
}) {
  const { user, userType } = useAuthContext();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: { progress: number, name: string } }>({});

  // Fetch documents based on user type and project ID
  const fetchDocuments = async (projectIdToFetch?: string) => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let fetchedDocuments: Document[] = [];
      
      if (projectIdToFetch) {
        // Fetch documents for a specific project
        fetchedDocuments = await getDocumentsByProject(projectIdToFetch);
      } else if (userType === 'customer') {
        // Customers can only see their own documents
        fetchedDocuments = await getDocumentsByCustomer(user.uid);
      } else {
        // For staff without a specific project, we don't fetch documents
        // They should select a project first
        fetchedDocuments = [];
      }
      
      setDocuments(fetchedDocuments);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDocuments(projectId);
  }, [user, userType, projectId]);

  // Get a document by ID
  const getDocumentById = async (id: string): Promise<Document | null> => {
    try {
      return await getDocument(id);
    } catch (err) {
      console.error('Error getting document by ID:', err);
      setError(err instanceof Error ? err : new Error('Failed to get document'));
      return null;
    }
  };

  // Upload a file
  const uploadFile = async (
    file: File, 
    projectIdForUpload: string, 
    documentType: DocumentType, 
    required: boolean
  ): Promise<void> => {
    if (!user) return;
    
    const fileId = `${Date.now()}-${file.name}`;
    
    try {
      // Add file to uploading state
      setUploadingFiles(prev => ({
        ...prev,
        [fileId]: { progress: 0, name: file.name }
      }));
      
      // Create a mock progress update function
      const onProgress = (progress: number) => {
        setUploadingFiles(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], progress }
        }));
      };
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => {
          const currentProgress = prev[fileId]?.progress || 0;
          if (currentProgress >= 100) {
            clearInterval(progressInterval);
            return prev;
          }
          return {
            ...prev,
            [fileId]: { ...prev[fileId], progress: Math.min(currentProgress + 10, 100) }
          };
        });
      }, 300);
      
      // Upload the document
      await uploadDocument(
        file,
        projectIdForUpload,
        user.uid,
        documentType,
        required,
        user.uid
      );
      
      // Clear interval and remove file from uploading state
      clearInterval(progressInterval);
      setUploadingFiles(prev => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
      
      // Refresh documents
      await fetchDocuments(projectId || projectIdForUpload);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err instanceof Error ? err : new Error('Failed to upload file'));
      
      // Clear interval and update uploading state to show error
      setUploadingFiles(prev => {
        const newState = { ...prev };
        delete newState[fileId];
        return newState;
      });
    }
  };

  // Update document status
  const updateStatus = async (documentId: string, status: DocumentStatus): Promise<void> => {
    if (!user) return;
    
    try {
      await updateDocumentStatus(
        documentId,
        status,
        user.uid
      );
      
      // Refresh documents
      await fetchDocuments(projectId);
    } catch (err) {
      console.error('Error updating document status:', err);
      setError(err instanceof Error ? err : new Error('Failed to update document status'));
    }
  };

  // Delete a document
  const deleteFile = async (documentId: string): Promise<void> => {
    try {
      await deleteDocument(documentId);
      
      // Refresh documents
      await fetchDocuments(projectId);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete document'));
    }
  };

  // Refresh documents
  const refreshDocuments = async (refreshProjectId?: string): Promise<void> => {
    await fetchDocuments(refreshProjectId || projectId);
  };

  return (
    <DocumentsContext.Provider
      value={{
        documents,
        loading,
        error,
        uploadingFiles,
        refreshDocuments,
        getDocumentById,
        uploadFile,
        updateStatus,
        deleteFile
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
}
