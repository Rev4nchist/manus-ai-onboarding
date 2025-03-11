'use client';

import React from 'react';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ProjectsProvider } from '@/components/providers/projects-provider';
import { DocumentsProvider } from '@/components/providers/documents-provider';
import { FormsProvider } from '@/components/providers/forms-provider';
import { SchedulingProvider } from '@/components/providers/scheduling-provider';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProjectsProvider>
        {children}
      </ProjectsProvider>
    </AuthProvider>
  );
}

export function CustomerPortalProvider({ 
  children,
  projectId 
}: { 
  children: React.ReactNode;
  projectId: string;
}) {
  return (
    <DocumentsProvider projectId={projectId}>
      <FormsProvider projectId={projectId}>
        <SchedulingProvider projectId={projectId}>
          {children}
        </SchedulingProvider>
      </FormsProvider>
    </DocumentsProvider>
  );
}

export function StaffDashboardProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProjectsProvider>
      {children}
    </ProjectsProvider>
  );
}

export function ProjectDetailProvider({ 
  children,
  projectId 
}: { 
  children: React.ReactNode;
  projectId: string;
}) {
  return (
    <DocumentsProvider projectId={projectId}>
      <FormsProvider projectId={projectId}>
        <SchedulingProvider projectId={projectId}>
          {children}
        </SchedulingProvider>
      </FormsProvider>
    </DocumentsProvider>
  );
}
