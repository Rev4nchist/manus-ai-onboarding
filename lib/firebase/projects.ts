// lib/firebase/projects.ts - CRUD operations for projects

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
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Project, ProjectStatus } from '@/lib/types/project';

const PROJECTS_COLLECTION = 'projects';

// Create a new project
export const createProject = async (projectData: Omit<Project, 'id' | 'lastUpdated'>): Promise<Project> => {
  try {
    // Create a new document reference
    const projectRef = doc(collection(db, PROJECTS_COLLECTION));
    
    // Add timestamps and ID
    const newProject: Project = {
      ...projectData,
      id: projectRef.id,
      lastUpdated: Timestamp.now(),
      activities: [
        {
          id: `activity-${Date.now()}`,
          timestamp: Timestamp.now(),
          type: 'status',
          description: 'Project created',
          performedBy: 'system',
          performedByType: 'system'
        }
      ]
    };
    
    // Save to Firestore
    await setDoc(projectRef, newProject);
    
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Get a project by ID
export const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (projectSnap.exists()) {
      return { id: projectSnap.id, ...projectSnap.data() } as Project;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};

// Update a project
export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...projectData,
      lastUpdated: serverTimestamp()
    };
    
    await updateDoc(projectRef, dataWithTimestamp);
    
    // Get the updated project
    const updatedProject = await getProject(projectId);
    if (!updatedProject) {
      throw new Error('Project not found after update');
    }
    
    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const projectsSnap = await getDocs(projectsRef);
    
    return projectsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw error;
  }
};

// Get projects by customer ID
export const getProjectsByCustomer = async (customerId: string): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsRef, where('customerId', '==', customerId));
    const projectsSnap = await getDocs(q);
    
    return projectsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects by customer:', error);
    throw error;
  }
};

// Get projects by staff ID
export const getProjectsByStaff = async (staffId: string): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsRef, where('assignedStaffId', '==', staffId));
    const projectsSnap = await getDocs(q);
    
    return projectsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects by staff:', error);
    throw error;
  }
};

// Get projects by status
export const getProjectsByStatus = async (status: ProjectStatus): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsRef, where('status', '==', status));
    const projectsSnap = await getDocs(q);
    
    return projectsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects by status:', error);
    throw error;
  }
};

// Update project status
export const updateProjectStatus = async (
  projectId: string, 
  status: ProjectStatus, 
  performedBy: string,
  performedByType: 'customer' | 'staff' | 'system'
): Promise<Project> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    const project = { id: projectSnap.id, ...projectSnap.data() } as Project;
    
    // Create a new activity log entry
    const activity = {
      id: `activity-${Date.now()}`,
      timestamp: Timestamp.now(),
      type: 'status' as const,
      description: `Status changed to ${status}`,
      performedBy,
      performedByType
    };
    
    // Update the project
    await updateDoc(projectRef, {
      status,
      lastUpdated: serverTimestamp(),
      activities: [...project.activities, activity]
    });
    
    // Get the updated project
    const updatedProject = await getProject(projectId);
    if (!updatedProject) {
      throw new Error('Project not found after update');
    }
    
    return updatedProject;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
};

// Add a note to a project
export const addProjectNote = async (
  projectId: string,
  content: string,
  createdBy: string,
  createdByType: 'customer' | 'staff',
  isInternal: boolean
): Promise<Project> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    const project = { id: projectSnap.id, ...projectSnap.data() } as Project;
    
    // Create a new note
    const note = {
      id: `note-${Date.now()}`,
      content,
      createdAt: Timestamp.now(),
      createdBy,
      createdByType,
      isInternal
    };
    
    // Create a new activity log entry
    const activity = {
      id: `activity-${Date.now()}`,
      timestamp: Timestamp.now(),
      type: 'note' as const,
      description: 'Note added',
      performedBy: createdBy,
      performedByType: createdByType
    };
    
    // Update the project
    await updateDoc(projectRef, {
      notes: [...project.notes, note],
      activities: [...project.activities, activity],
      lastUpdated: serverTimestamp()
    });
    
    // Get the updated project
    const updatedProject = await getProject(projectId);
    if (!updatedProject) {
      throw new Error('Project not found after update');
    }
    
    return updatedProject;
  } catch (error) {
    console.error('Error adding project note:', error);
    throw error;
  }
};

// Update project progress
export const updateProjectProgress = async (
  projectId: string,
  progress: number,
  performedBy: string,
  performedByType: 'customer' | 'staff' | 'system'
): Promise<Project> => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectSnap = await getDoc(projectRef);
    
    if (!projectSnap.exists()) {
      throw new Error('Project not found');
    }
    
    const project = { id: projectSnap.id, ...projectSnap.data() } as Project;
    
    // Create a new activity log entry
    const activity = {
      id: `activity-${Date.now()}`,
      timestamp: Timestamp.now(),
      type: 'status' as const,
      description: `Progress updated to ${progress}%`,
      performedBy,
      performedByType
    };
    
    // Update the project
    await updateDoc(projectRef, {
      progress,
      lastUpdated: serverTimestamp(),
      activities: [...project.activities, activity]
    });
    
    // Get the updated project
    const updatedProject = await getProject(projectId);
    if (!updatedProject) {
      throw new Error('Project not found after update');
    }
    
    return updatedProject;
  } catch (error) {
    console.error('Error updating project progress:', error);
    throw error;
  }
};
