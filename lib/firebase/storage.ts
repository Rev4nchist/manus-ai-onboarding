// lib/firebase/storage.ts
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask
} from 'firebase/storage';
import { storage } from './config';

// Upload file to Firebase Storage
export const uploadFile = (
  file: File,
  path: string,
  onProgress?: (progress: number) => void,
  onError?: (error: Error) => void
): UploadTask => {
  try {
    // Create storage reference
    const storageRef = ref(storage, path);
    
    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Monitor upload progress
    if (onProgress) {
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          if (onError) onError(error);
        }
      );
    }
    
    return uploadTask;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get download URL for a file
export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

// Delete a file from storage
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// List all files in a directory
export const listFiles = async (path: string): Promise<string[]> => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    // Return array of file names
    return result.items.map(item => item.name);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

// Generate a unique file path for uploads
export const generateFilePath = (
  userId: string,
  fileName: string,
  folder: string = 'documents'
): string => {
  // Create a unique file name to prevent collisions
  const timestamp = new Date().getTime();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  
  return `${folder}/${userId}/${timestamp}_${cleanFileName}`;
};
