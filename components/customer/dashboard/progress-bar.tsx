'use client';

import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ 
  percentage, 
  showLabel = true, 
  size = 'md' 
}: ProgressBarProps) {
  // Ensure percentage is between 0 and 100
  const validPercentage = Math.min(Math.max(percentage, 0), 100);
  
  // Determine color based on progress
  const getColorClass = () => {
    if (validPercentage < 30) return 'bg-red-500';
    if (validPercentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Determine height based on size
  const getHeightClass = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'lg': return 'h-6';
      default: return 'h-4';
    }
  };
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Onboarding Progress</span>
          <span className="text-sm font-medium">{validPercentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${getHeightClass()}`}>
        <div 
          className={`${getColorClass()} ${getHeightClass()} rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${validPercentage}%` }}
        >
          {size === 'lg' && showLabel && (
            <span className="flex justify-center items-center h-full text-xs font-medium text-white">
              {validPercentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
