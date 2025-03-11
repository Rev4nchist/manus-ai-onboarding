'use client';

import React from 'react';
import { Project } from '@/lib/types/project';

interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  project: Project;
  isActive?: boolean;
  href?: string;
}

export function ProjectCard({ 
  project, 
  isActive = false,
  href,
  className, 
  ...props 
}: ProjectCardProps) {
  // Get status color
  const getStatusColor = () => {
    switch (project.status) {
      case 'On Track': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const card = (
    <div 
      className={`
        bg-white border rounded-lg shadow-sm transition-all duration-200 hover:shadow-md
        ${isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}
        ${className || ''}
      `} 
      {...props}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{project.customerName}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">{project.companyName}</p>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  project.progress < 30 ? 'bg-red-500' : 
                  project.progress < 70 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500">Documents</span>
              <p className="font-medium">{project.documents.uploaded.length} / {project.documents.required.length}</p>
            </div>
            <div>
              <span className="text-gray-500">Forms</span>
              <p className="font-medium">{project.forms.completed.length} / {project.forms.required.length}</p>
            </div>
            <div>
              <span className="text-gray-500">Call</span>
              <p className="font-medium">{project.callScheduled ? 'Scheduled' : 'Pending'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (href) {
    return (
      <a href={href} className="block">
        {card}
      </a>
    );
  }
  
  return card;
}
