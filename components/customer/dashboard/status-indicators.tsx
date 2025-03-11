'use client';

import React from 'react';

type StatusType = 'completed' | 'in-progress' | 'pending' | 'warning';

interface StatusIndicatorProps {
  status: StatusType;
  label: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusIndicator({
  status,
  label,
  description,
  size = 'md'
}: StatusIndicatorProps) {
  // Determine color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'pending': 
      default: return 'bg-gray-300';
    }
  };
  
  // Determine icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-6 w-6 text-xs';
      case 'lg': return 'h-10 w-10 text-base';
      default: return 'h-8 w-8 text-sm';
    }
  };
  
  return (
    <div className="flex items-center">
      <div className={`${getStatusColor()} ${getSizeClasses()} rounded-full flex items-center justify-center flex-shrink-0`}>
        {getStatusIcon()}
      </div>
      <div className="ml-3">
        <p className="font-medium">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );
}

interface TaskItemProps {
  task: {
    title: string;
    status: 'completed' | 'in-progress' | 'pending' | 'warning';
    dueDate?: string;
  };
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="p-4 border rounded-md bg-white">
      <StatusIndicator 
        status={task.status} 
        label={task.title} 
        description={task.dueDate ? `Due: ${task.dueDate}` : undefined}
      />
    </div>
  );
}

interface TaskListProps {
  tasks: Array<{
    title: string;
    status: 'completed' | 'in-progress' | 'pending' | 'warning';
    dueDate?: string;
  }>;
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Tasks</h3>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <TaskItem key={index} task={task} />
        ))}
      </div>
    </div>
  );
}
