// lib/firebase/scheduling.ts - CRUD operations for scheduling

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
import { updateProject } from './projects';

const APPOINTMENTS_COLLECTION = 'appointments';

interface Appointment {
  id: string;
  projectId: string;
  customerId: string;
  date: Timestamp;
  time: string;
  duration: number; // in minutes
  type: 'onboarding' | 'follow-up' | 'review';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
}

// Schedule a call
export const scheduleCall = async (
  projectId: string,
  customerId: string,
  date: Date,
  time: string,
  duration: number = 30,
  type: 'onboarding' | 'follow-up' | 'review' = 'onboarding',
  notes?: string,
  createdBy: string
): Promise<Appointment> => {
  try {
    // Create a new document reference
    const appointmentRef = doc(collection(db, APPOINTMENTS_COLLECTION));
    
    // Create the appointment
    const appointment: Appointment = {
      id: appointmentRef.id,
      projectId,
      customerId,
      date: Timestamp.fromDate(date),
      time,
      duration,
      type,
      status: 'scheduled',
      notes,
      createdAt: Timestamp.now(),
      createdBy,
      updatedAt: Timestamp.now()
    };
    
    // Save to Firestore
    await setDoc(appointmentRef, appointment);
    
    // Update project with call scheduled
    await updateProject(projectId, {
      callScheduled: Timestamp.fromDate(date)
    });
    
    return appointment;
  } catch (error) {
    console.error('Error scheduling call:', error);
    throw error;
  }
};

// Get an appointment by ID
export const getAppointment = async (appointmentId: string): Promise<Appointment | null> => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);
    
    if (appointmentSnap.exists()) {
      return { id: appointmentSnap.id, ...appointmentSnap.data() } as Appointment;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting appointment:', error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (
  appointmentId: string,
  appointmentData: Partial<Appointment>
): Promise<Appointment> => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...appointmentData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(appointmentRef, dataWithTimestamp);
    
    // Get the updated appointment
    const updatedAppointment = await getAppointment(appointmentId);
    if (!updatedAppointment) {
      throw new Error('Appointment not found after update');
    }
    
    // If the date was updated, update the project as well
    if (appointmentData.date && updatedAppointment.projectId) {
      await updateProject(updatedAppointment.projectId, {
        callScheduled: appointmentData.date
      });
    }
    
    return updatedAppointment;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Cancel an appointment
export const cancelAppointment = async (
  appointmentId: string,
  cancelledBy: string
): Promise<Appointment> => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);
    
    if (!appointmentSnap.exists()) {
      throw new Error('Appointment not found');
    }
    
    const appointment = { id: appointmentSnap.id, ...appointmentSnap.data() } as Appointment;
    
    // Update the appointment
    await updateDoc(appointmentRef, {
      status: 'cancelled',
      updatedAt: serverTimestamp()
    });
    
    // Update project to remove scheduled call
    await updateProject(appointment.projectId, {
      callScheduled: null
    });
    
    // Get the updated appointment
    const updatedAppointment = await getAppointment(appointmentId);
    if (!updatedAppointment) {
      throw new Error('Appointment not found after update');
    }
    
    return updatedAppointment;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

// Get appointments by project ID
export const getAppointmentsByProject = async (projectId: string): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION);
    const q = query(
      appointmentsRef, 
      where('projectId', '==', projectId),
      orderBy('date', 'desc')
    );
    const appointmentsSnap = await getDocs(q);
    
    return appointmentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
  } catch (error) {
    console.error('Error getting appointments by project:', error);
    throw error;
  }
};

// Get appointments by customer ID
export const getAppointmentsByCustomer = async (customerId: string): Promise<Appointment[]> => {
  try {
    const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION);
    const q = query(
      appointmentsRef, 
      where('customerId', '==', customerId),
      orderBy('date', 'desc')
    );
    const appointmentsSnap = await getDocs(q);
    
    return appointmentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
  } catch (error) {
    console.error('Error getting appointments by customer:', error);
    throw error;
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (): Promise<Appointment[]> => {
  try {
    const now = Timestamp.now();
    const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION);
    const q = query(
      appointmentsRef, 
      where('date', '>=', now),
      where('status', '==', 'scheduled'),
      orderBy('date', 'asc')
    );
    const appointmentsSnap = await getDocs(q);
    
    return appointmentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
  } catch (error) {
    console.error('Error getting upcoming appointments:', error);
    throw error;
  }
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (date: Date): Promise<string[]> => {
  try {
    // Define all possible time slots
    const allTimeSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM', 
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];
    
    // Get appointments for the specified date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const appointmentsRef = collection(db, APPOINTMENTS_COLLECTION);
    const q = query(
      appointmentsRef,
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      where('status', '==', 'scheduled')
    );
    const appointmentsSnap = await getDocs(q);
    
    // Get booked time slots
    const bookedTimeSlots = appointmentsSnap.docs.map(doc => {
      const data = doc.data();
      return data.time;
    });
    
    // Filter out booked slots
    const availableTimeSlots = allTimeSlots.filter(
      slot => !bookedTimeSlots.includes(slot)
    );
    
    return availableTimeSlots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    throw error;
  }
};

// Mark appointment as completed
export const completeAppointment = async (
  appointmentId: string,
  notes?: string
): Promise<Appointment> => {
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);
    
    if (!appointmentSnap.exists()) {
      throw new Error('Appointment not found');
    }
    
    // Update the appointment
    const updateData: any = {
      status: 'completed',
      updatedAt: serverTimestamp()
    };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    await updateDoc(appointmentRef, updateData);
    
    // Get the updated appointment
    const updatedAppointment = await getAppointment(appointmentId);
    if (!updatedAppointment) {
      throw new Error('Appointment not found after update');
    }
    
    return updatedAppointment;
  } catch (error) {
    console.error('Error completing appointment:', error);
    throw error;
  }
};

export { Appointment };
