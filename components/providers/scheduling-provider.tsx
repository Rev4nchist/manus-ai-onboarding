'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from './auth-provider';
import { 
  scheduleCall,
  getAppointment,
  getAppointmentsByProject,
  getAppointmentsByCustomer,
  updateAppointment,
  cancelAppointment,
  getAvailableTimeSlots,
  completeAppointment,
  Appointment
} from '@/lib/firebase/scheduling';

interface SchedulingContextType {
  appointments: Appointment[];
  loading: boolean;
  error: Error | null;
  availableSlots: string[];
  refreshAppointments: (projectId?: string) => Promise<void>;
  getAppointmentById: (id: string) => Promise<Appointment | null>;
  scheduleAppointment: (projectId: string, date: Date, time: string, notes?: string) => Promise<void>;
  cancelScheduledAppointment: (appointmentId: string) => Promise<void>;
  completeScheduledAppointment: (appointmentId: string, notes?: string) => Promise<void>;
  getAvailableTimes: (date: Date) => Promise<string[]>;
}

const SchedulingContext = createContext<SchedulingContextType | undefined>(undefined);

export function SchedulingProvider({ 
  children,
  projectId 
}: { 
  children: ReactNode;
  projectId?: string;
}) {
  const { user, userType } = useAuthContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch appointments based on user type and project ID
  const fetchAppointments = async (projectIdToFetch?: string) => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let fetchedAppointments: Appointment[] = [];
      
      if (projectIdToFetch) {
        // Fetch appointments for a specific project
        fetchedAppointments = await getAppointmentsByProject(projectIdToFetch);
      } else if (userType === 'customer') {
        // Customers can only see their own appointments
        fetchedAppointments = await getAppointmentsByCustomer(user.uid);
      } else {
        // For staff without a specific project, we don't fetch appointments
        // They should select a project first
        fetchedAppointments = [];
      }
      
      setAppointments(fetchedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch appointments'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAppointments(projectId);
  }, [user, userType, projectId]);

  // Get an appointment by ID
  const getAppointmentById = async (id: string): Promise<Appointment | null> => {
    try {
      return await getAppointment(id);
    } catch (err) {
      console.error('Error getting appointment by ID:', err);
      setError(err instanceof Error ? err : new Error('Failed to get appointment'));
      return null;
    }
  };

  // Schedule an appointment
  const scheduleAppointment = async (
    projectIdForSchedule: string, 
    date: Date, 
    time: string, 
    notes?: string
  ): Promise<void> => {
    if (!user) return;
    
    try {
      await scheduleCall(
        projectIdForSchedule,
        user.uid,
        date,
        time,
        30, // Default duration: 30 minutes
        'onboarding', // Default type: onboarding
        notes,
        user.uid
      );
      
      // Refresh appointments
      await fetchAppointments(projectId || projectIdForSchedule);
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to schedule appointment'));
    }
  };

  // Cancel an appointment
  const cancelScheduledAppointment = async (appointmentId: string): Promise<void> => {
    if (!user) return;
    
    try {
      await cancelAppointment(appointmentId, user.uid);
      
      // Refresh appointments
      await fetchAppointments(projectId);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to cancel appointment'));
    }
  };

  // Complete an appointment
  const completeScheduledAppointment = async (appointmentId: string, notes?: string): Promise<void> => {
    try {
      await completeAppointment(appointmentId, notes);
      
      // Refresh appointments
      await fetchAppointments(projectId);
    } catch (err) {
      console.error('Error completing appointment:', err);
      setError(err instanceof Error ? err : new Error('Failed to complete appointment'));
    }
  };

  // Get available time slots for a date
  const getAvailableTimes = async (date: Date): Promise<string[]> => {
    try {
      const slots = await getAvailableTimeSlots(date);
      setAvailableSlots(slots);
      return slots;
    } catch (err) {
      console.error('Error getting available time slots:', err);
      setError(err instanceof Error ? err : new Error('Failed to get available time slots'));
      return [];
    }
  };

  // Refresh appointments
  const refreshAppointments = async (refreshProjectId?: string): Promise<void> => {
    await fetchAppointments(refreshProjectId || projectId);
  };

  return (
    <SchedulingContext.Provider
      value={{
        appointments,
        loading,
        error,
        availableSlots,
        refreshAppointments,
        getAppointmentById,
        scheduleAppointment,
        cancelScheduledAppointment,
        completeScheduledAppointment,
        getAvailableTimes
      }}
    >
      {children}
    </SchedulingContext.Provider>
  );
}

export function useScheduling() {
  const context = useContext(SchedulingContext);
  if (context === undefined) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
}
