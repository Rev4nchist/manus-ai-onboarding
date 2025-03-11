// lib/firebase/firestore.ts
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
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Generic function to add a document to a collection
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T,
  id?: string
) => {
  try {
    const docRef = id 
      ? doc(db, collectionName, id) 
      : doc(collection(db, collectionName));
    
    // Add timestamps for tracking
    const dataWithTimestamps = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(docRef, dataWithTimestamps);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Generic function to get a document by ID
export const getDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// Generic function to update a document
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
) => {
  try {
    const docRef = doc(db, collectionName, id);
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, dataWithTimestamp);
    return { id, ...data };
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Generic function to delete a document
export const deleteDocument = async (
  collectionName: string,
  id: string
) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return { id };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Generic function to query documents
export const queryDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

// Helper functions for common query constraints
export const whereEqual = (field: string, value: any) => where(field, '==', value);
export const orderByField = (field: string, direction: 'asc' | 'desc' = 'asc') => 
  orderBy(field, direction);
export const limitResults = (n: number) => limit(n);

// Export Timestamp for use in application
export { Timestamp };
