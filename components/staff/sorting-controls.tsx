'use client';

import React from 'react';

interface SortingControlsProps {
  sortBy: 'name' | 'date' | 'progress';
  onSortChange: (sortBy: 'name' | 'date' | 'progress') => void;
}

export function SortingControls({
  sortBy,
  onSortChange
}: SortingControlsProps) {
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' },
    { value: 'progress', label: 'Progress' }
  ];
  
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">Sort by:</label>
      <select
        className="pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'name' | 'date' | 'progress')}
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
