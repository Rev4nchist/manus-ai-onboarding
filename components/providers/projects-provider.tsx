'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from './auth-provider';
import { 
  getProject, 
  getAllProjects, 
  getProjectsByCustomer,
  getProjectsByStaff,
  getProjectsByStatus,
  updateProjectStatus,
  updateProjectProgress,
  addProjectNote
} from '@/lib/firebase/projects';
import { Project, ProjectStatus } from '@/lib/types/project';

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  refreshProjects: () => Promise<void>;
  getProjectById: (id: string) => Promise<Project | null>;
  updateStatus: (projectId: string, status: ProjectStatus) => Promise<void>;
  updateProgress: (projectId: string, progress: number) => Promise<void>;
  addNote: (projectId: string, content: string, isInternal: boolean) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const { user, userType } = useAuthContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects based on user type
  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let fetchedProjects: Project[] = [];
      
      if (userType === 'staff') {
        // Staff can see all projects or just assigned ones based on role
        // For MVP, we'll show all projects
        fetchedProjects = await getAllProjects();
      } else if (userType === 'customer') {
        // Customers can only see their own projects
        fetchedProjects = await getProjectsByCustomer(user.uid);
      }
      
      setProjects(fetchedProjects);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [user, userType]);

  // Get a project by ID
  const getProjectById = async (id: string): Promise<Project | null> => {
    try {
      return await getProject(id);
    } catch (err) {
      console.error('Error getting project by ID:', err);
      setError(err instanceof Error ? err : new Error('Failed to get project'));
      return null;
    }
  };

  // Update project status
  const updateStatus = async (projectId: string, status: ProjectStatus): Promise<void> => {
    if (!user) return;
    
    try {
      await updateProjectStatus(
        projectId,
        status,
        user.uid,
        userType === 'customer' ? 'customer' : 'staff'
      );
      
      // Refresh projects
      await fetchProjects();
    } catch (err) {
      console.error('Error updating project status:', err);
      setError(err instanceof Error ? err : new Error('Failed to update project status'));
    }
  };

  // Update project progress
  const updateProgress = async (projectId: string, progress: number): Promise<void> => {
    if (!user) return;
    
    try {
      await updateProjectProgress(
        projectId,
        progress,
        user.uid,
        userType === 'customer' ? 'customer' : 'staff'
      );
      
      // Refresh projects
      await fetchProjects();
    } catch (err) {
      console.error('Error updating project progress:', err);
      setError(err instanceof Error ? err : new Error('Failed to update project progress'));
    }
  };

  // Add a note to a project
  const addNote = async (projectId: string, content: string, isInternal: boolean): Promise<void> => {
    if (!user) return;
    
    try {
      await addProjectNote(
        projectId,
        content,
        user.uid,
        userType === 'customer' ? 'customer' : 'staff',
        isInternal
      );
      
      // Refresh projects
      await fetchProjects();
    } catch (err) {
      console.error('Error adding project note:', err);
      setError(err instanceof Error ? err : new Error('Failed to add project note'));
    }
  };

  // Refresh projects
  const refreshProjects = async (): Promise<void> => {
    await fetchProjects();
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        error,
        selectedProject,
        setSelectedProject,
        refreshProjects,
        getProjectById,
        updateStatus,
        updateProgress,
        addNote
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
