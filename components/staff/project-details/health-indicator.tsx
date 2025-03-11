'use client';

import React from 'react';

interface HealthIndicatorProps {
  status: 'On Track' | 'Delayed' | 'Completed';
  size?: 'sm' | 'md' | 'lg';
}

export function HealthIndicator({
  status,
  size = 'md'
}: HealthIndicatorProps) {
  // Determine color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'On Track': return 'bg-green-500';
      case 'Delayed': return 'bg-yellow-500';
      case 'Completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8 text-xs';
      case 'lg': return 'h-16 w-16 text-base';
      default: return 'h-12 w-12 text-sm';
    }
  };
  
  return (
    <div className={`${getSizeClasses()} ${getStatusColor()} rounded-full flex items-center justify-center text-white font-medium`}>
      {status === 'On Track' && 'OT'}
      {status === 'Delayed' && 'DL'}
      {status === 'Completed' && 'CP'}
    </div>
  );
}
