'use client';

import React from 'react';
import { ProjectStatus } from '@/lib/types/project';

interface ProjectFiltersProps {
  selectedFilter: ProjectStatus | 'all';
  onFilterChange: (filter: ProjectStatus | 'all') => void;
}

export function ProjectFilters({
  selectedFilter,
  onFilterChange
}: ProjectFiltersProps) {
  const filters: Array<{ value: ProjectStatus | 'all', label: string }> = [
    { value: 'all', label: 'All Projects' },
    { value: 'On Track', label: 'On Track' },
    { value: 'Delayed', label: 'Delayed' },
    { value: 'Completed', label: 'Completed' }
  ];
  
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.value}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-full transition-colors
            ${selectedFilter === filter.value
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
          `}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
