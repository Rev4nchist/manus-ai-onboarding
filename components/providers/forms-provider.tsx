'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from './auth-provider';
import { 
  createForm,
  getForm,
  getFormsByProject,
  getFormsByCustomer,
  updateFormStatus,
  submitFormResponse,
  getFormResponsesByForm,
  getFormResponsesByProject
} from '@/lib/firebase/forms';
import { Form, FormResponse, FormStatus, FormType } from '@/lib/types/form';

interface FormsContextType {
  forms: Form[];
  responses: FormResponse[];
  loading: boolean;
  error: Error | null;
  refreshForms: (projectId?: string) => Promise<void>;
  getFormById: (id: string) => Promise<Form | null>;
  submitResponse: (formId: string, projectId: string, responses: { [fieldId: string]: any }) => Promise<void>;
  updateStatus: (formId: string, status: FormStatus) => Promise<void>;
  getResponsesForForm: (formId: string) => Promise<FormResponse[]>;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export function FormsProvider({ 
  children,
  projectId 
}: { 
  children: ReactNode;
  projectId?: string;
}) {
  const { user, userType } = useAuthContext();
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch forms based on user type and project ID
  const fetchForms = async (projectIdToFetch?: string) => {
    if (!user) {
      setForms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let fetchedForms: Form[] = [];
      let fetchedResponses: FormResponse[] = [];
      
      if (projectIdToFetch) {
        // Fetch forms for a specific project
        fetchedForms = await getFormsByProject(projectIdToFetch);
        fetchedResponses = await getFormResponsesByProject(projectIdToFetch);
      } else if (userType === 'customer') {
        // Customers can only see their own forms
        fetchedForms = await getFormsByCustomer(user.uid);
      } else {
        // For staff without a specific project, we don't fetch forms
        // They should select a project first
        fetchedForms = [];
      }
      
      setForms(fetchedForms);
      setResponses(fetchedResponses);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch forms'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchForms(projectId);
  }, [user, userType, projectId]);

  // Get a form by ID
  const getFormById = async (id: string): Promise<Form | null> => {
    try {
      return await getForm(id);
    } catch (err) {
      console.error('Error getting form by ID:', err);
      setError(err instanceof Error ? err : new Error('Failed to get form'));
      return null;
    }
  };

  // Submit form response
  const submitResponse = async (
    formId: string, 
    projectIdForSubmission: string, 
    responseData: { [fieldId: string]: any }
  ): Promise<void> => {
    if (!user) return;
    
    try {
      await submitFormResponse(
        formId,
        projectIdForSubmission,
        user.uid,
        responseData,
        user.uid
      );
      
      // Refresh forms
      await fetchForms(projectId || projectIdForSubmission);
    } catch (err) {
      console.error('Error submitting form response:', err);
      setError(err instanceof Error ? err : new Error('Failed to submit form response'));
    }
  };

  // Update form status
  const updateStatus = async (formId: string, status: FormStatus): Promise<void> => {
    if (!user) return;
    
    try {
      await updateFormStatus(
        formId,
        status,
        user.uid
      );
      
      // Refresh forms
      await fetchForms(projectId);
    } catch (err) {
      console.error('Error updating form status:', err);
      setError(err instanceof Error ? err : new Error('Failed to update form status'));
    }
  };

  // Get responses for a specific form
  const getResponsesForForm = async (formId: string): Promise<FormResponse[]> => {
    try {
      return await getFormResponsesByForm(formId);
    } catch (err) {
      console.error('Error getting form responses:', err);
      setError(err instanceof Error ? err : new Error('Failed to get form responses'));
      return [];
    }
  };

  // Refresh forms
  const refreshForms = async (refreshProjectId?: string): Promise<void> => {
    await fetchForms(refreshProjectId || projectId);
  };

  return (
    <FormsContext.Provider
      value={{
        forms,
        responses,
        loading,
        error,
        refreshForms,
        getFormById,
        submitResponse,
        updateStatus,
        getResponsesForForm
      }}
    >
      {children}
    </FormsContext.Provider>
  );
}

export function useForms() {
  const context = useContext(FormsContext);
  if (context === undefined) {
    throw new Error('useForms must be used within a FormsProvider');
  }
  return context;
}
