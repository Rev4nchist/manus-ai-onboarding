// lib/firebase/forms.ts - CRUD operations for forms

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
import { db } from './config';
import { Form, FormResponse, FormStatus, FormType } from '@/lib/types/form';
import { updateProjectProgress } from './projects';

const FORMS_COLLECTION = 'forms';
const FORM_RESPONSES_COLLECTION = 'form_responses';

// Create a new form
export const createForm = async (formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): Promise<Form> => {
  try {
    // Create a new document reference
    const formRef = doc(collection(db, FORMS_COLLECTION));
    
    // Add timestamps and ID
    const newForm: Form = {
      ...formData,
      id: formRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    // Save to Firestore
    await setDoc(formRef, newForm);
    
    return newForm;
  } catch (error) {
    console.error('Error creating form:', error);
    throw error;
  }
};

// Get a form by ID
export const getForm = async (formId: string): Promise<Form | null> => {
  try {
    const formRef = doc(db, FORMS_COLLECTION, formId);
    const formSnap = await getDoc(formRef);
    
    if (formSnap.exists()) {
      return { id: formSnap.id, ...formSnap.data() } as Form;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting form:', error);
    throw error;
  }
};

// Update a form
export const updateForm = async (formId: string, formData: Partial<Form>): Promise<Form> => {
  try {
    const formRef = doc(db, FORMS_COLLECTION, formId);
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...formData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(formRef, dataWithTimestamp);
    
    // Get the updated form
    const updatedForm = await getForm(formId);
    if (!updatedForm) {
      throw new Error('Form not found after update');
    }
    
    return updatedForm;
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
};

// Delete a form
export const deleteForm = async (formId: string): Promise<void> => {
  try {
    const formRef = doc(db, FORMS_COLLECTION, formId);
    await deleteDoc(formRef);
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
};

// Get forms by project ID
export const getFormsByProject = async (projectId: string): Promise<Form[]> => {
  try {
    const formsRef = collection(db, FORMS_COLLECTION);
    const q = query(formsRef, where('projectId', '==', projectId), orderBy('order'));
    const formsSnap = await getDocs(q);
    
    return formsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Form[];
  } catch (error) {
    console.error('Error getting forms by project:', error);
    throw error;
  }
};

// Get forms by customer ID
export const getFormsByCustomer = async (customerId: string): Promise<Form[]> => {
  try {
    const formsRef = collection(db, FORMS_COLLECTION);
    const q = query(formsRef, where('customerId', '==', customerId));
    const formsSnap = await getDocs(q);
    
    return formsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Form[];
  } catch (error) {
    console.error('Error getting forms by customer:', error);
    throw error;
  }
};

// Submit a form response
export const submitFormResponse = async (
  formId: string,
  projectId: string,
  customerId: string,
  responses: { [fieldId: string]: any },
  submittedBy: string
): Promise<FormResponse> => {
  try {
    // Get the form to check version
    const form = await getForm(formId);
    if (!form) {
      throw new Error('Form not found');
    }
    
    // Create a new document reference
    const responseRef = doc(collection(db, FORM_RESPONSES_COLLECTION));
    
    // Create the form response
    const formResponse: FormResponse = {
      id: responseRef.id,
      formId,
      projectId,
      customerId,
      responses,
      submittedAt: Timestamp.now(),
      submittedBy,
      formVersion: form.version
    };
    
    // Save to Firestore
    await setDoc(responseRef, formResponse);
    
    // Update form status to completed
    await updateFormStatus(formId, 'completed', submittedBy);
    
    // Update project progress
    await updateProjectFormStatus(projectId, formId, 'completed', submittedBy);
    
    return formResponse;
  } catch (error) {
    console.error('Error submitting form response:', error);
    throw error;
  }
};

// Get form responses by form ID
export const getFormResponsesByForm = async (formId: string): Promise<FormResponse[]> => {
  try {
    const responsesRef = collection(db, FORM_RESPONSES_COLLECTION);
    const q = query(responsesRef, where('formId', '==', formId));
    const responsesSnap = await getDocs(q);
    
    return responsesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FormResponse[];
  } catch (error) {
    console.error('Error getting form responses by form:', error);
    throw error;
  }
};

// Get form responses by project ID
export const getFormResponsesByProject = async (projectId: string): Promise<FormResponse[]> => {
  try {
    const responsesRef = collection(db, FORM_RESPONSES_COLLECTION);
    const q = query(responsesRef, where('projectId', '==', projectId));
    const responsesSnap = await getDocs(q);
    
    return responsesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FormResponse[];
  } catch (error) {
    console.error('Error getting form responses by project:', error);
    throw error;
  }
};

// Get form responses by customer ID
export const getFormResponsesByCustomer = async (customerId: string): Promise<FormResponse[]> => {
  try {
    const responsesRef = collection(db, FORM_RESPONSES_COLLECTION);
    const q = query(responsesRef, where('customerId', '==', customerId));
    const responsesSnap = await getDocs(q);
    
    return responsesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FormResponse[];
  } catch (error) {
    console.error('Error getting form responses by customer:', error);
    throw error;
  }
};

// Update form status
export const updateFormStatus = async (
  formId: string,
  status: FormStatus,
  updatedBy: string
): Promise<Form> => {
  try {
    const formRef = doc(db, FORMS_COLLECTION, formId);
    const formSnap = await getDoc(formRef);
    
    if (!formSnap.exists()) {
      throw new Error('Form not found');
    }
    
    // Update fields based on status
    const updateData: any = { 
      status,
      updatedAt: serverTimestamp()
    };
    
    if (status === 'completed') {
      updateData.completedAt = Timestamp.now();
      updateData.completedBy = updatedBy;
    } else if (status === 'reviewed') {
      updateData.reviewedAt = Timestamp.now();
      updateData.reviewedBy = updatedBy;
    }
    
    // Update the form
    await updateDoc(formRef, updateData);
    
    // Get the updated form
    const updatedForm = await getForm(formId);
    if (!updatedForm) {
      throw new Error('Form not found after update');
    }
    
    return updatedForm;
  } catch (error) {
    console.error('Error updating form status:', error);
    throw error;
  }
};

// Helper function to update project form status and progress
const updateProjectFormStatus = async (
  projectId: string,
  formId: string,
  status: FormStatus,
  performedBy: string
): Promise<void> => {
  try {
    // Get all forms for this project
    const forms = await getFormsByProject(projectId);
    
    // Calculate progress based on required forms
    const requiredForms = forms.filter(form => form.required);
    const completedRequiredForms = requiredForms.filter(form => 
      form.status === 'completed' || form.status === 'reviewed'
    );
    
    // Calculate progress percentage
    const progress = requiredForms.length > 0 
      ? Math.round((completedRequiredForms.length / requiredForms.length) * 100)
      : 0;
    
    // Update project progress
    await updateProjectProgress(
      projectId,
      progress,
      performedBy,
      'customer'
    );
  } catch (error) {
    console.error('Error updating project form status:', error);
    throw error;
  }
};
