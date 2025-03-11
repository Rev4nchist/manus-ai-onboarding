'use client';

import { useState, useMemo } from 'react';
import { ProjectCard } from '@/components/staff/project-card';
import { ProjectFilters } from '@/components/staff/project-filters';
import { ProjectSearch } from '@/components/staff/project-search';
import { SortingControls } from '@/components/staff/sorting-controls';
import { ProjectStatus } from '@/lib/types/project';
import { Timestamp } from 'firebase/firestore';

// Mock data for MVP
const mockProjects = [
  {
    id: '1',
    customerId: 'cust1',
    customerName: 'Acme Corporation',
    companyName: 'Acme Inc.',
    status: 'On Track' as ProjectStatus,
    progress: 75,
    startDate: Timestamp.fromDate(new Date(2025, 2, 1)),
    documents: {
      required: ['id', 'contract', 'registration'],
      uploaded: ['id', 'contract']
    },
    forms: {
      required: ['company', 'requirements'],
      completed: ['company', 'requirements']
    },
    callScheduled: Timestamp.fromDate(new Date(2025, 2, 15)),
    lastUpdated: Timestamp.fromDate(new Date()),
    tags: ['enterprise', 'priority']
  },
  {
    id: '2',
    customerId: 'cust2',
    customerName: 'TechStart Solutions',
    companyName: 'TechStart LLC',
    status: 'Delayed' as ProjectStatus,
    progress: 30,
    startDate: Timestamp.fromDate(new Date(2025, 1, 15)),
    documents: {
      required: ['id', 'contract', 'registration'],
      uploaded: ['contract']
    },
    forms: {
      required: ['company', 'requirements'],
      completed: ['company']
    },
    callScheduled: null,
    lastUpdated: Timestamp.fromDate(new Date()),
    tags: ['startup']
  },
  {
    id: '3',
    customerId: 'cust3',
    customerName: 'Global Enterprises',
    companyName: 'Global Inc.',
    status: 'Completed' as ProjectStatus,
    progress: 100,
    startDate: Timestamp.fromDate(new Date(2025, 1, 1)),
    documents: {
      required: ['id', 'contract', 'registration'],
      uploaded: ['id', 'contract', 'registration']
    },
    forms: {
      required: ['company', 'requirements'],
      completed: ['company', 'requirements']
    },
    callScheduled: Timestamp.fromDate(new Date(2025, 1, 10)),
    lastUpdated: Timestamp.fromDate(new Date()),
    tags: ['enterprise']
  },
  {
    id: '4',
    customerId: 'cust4',
    customerName: 'Innovative Solutions',
    companyName: 'Innovative LLC',
    status: 'On Track' as ProjectStatus,
    progress: 60,
    startDate: Timestamp.fromDate(new Date(2025, 2, 5)),
    documents: {
      required: ['id', 'contract', 'registration'],
      uploaded: ['id', 'contract']
    },
    forms: {
      required: ['company', 'requirements'],
      completed: ['company']
    },
    callScheduled: Timestamp.fromDate(new Date(2025, 2, 20)),
    lastUpdated: Timestamp.fromDate(new Date()),
    tags: ['midsize']
  }
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'progress'>('date');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return mockProjects
      .filter(project => {
        // Filter by status
        if (filter !== 'all' && project.status !== filter) return false;
        
        // Filter by search query
        if (searchQuery && !project.customerName.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by selected criterion
        if (sortBy === 'name') {
          return a.customerName.localeCompare(b.customerName);
        } else if (sortBy === 'progress') {
          return b.progress - a.progress;
        } else {
          return b.startDate.toMillis() - a.startDate.toMillis();
        }
      });
  }, [filter, sortBy, searchQuery]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-64">
          <ProjectSearch 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        
        <div className="flex-1">
          <ProjectFilters 
            selectedFilter={filter}
            onFilterChange={setFilter}
          />
        </div>
        
        <div>
          <SortingControls 
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            href={`/staff/projects/${project.id}`}
          />
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-40 border rounded-md bg-gray-50">
            <p className="text-gray-500">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
}
