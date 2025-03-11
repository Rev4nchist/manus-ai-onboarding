'use client';

import { useState, useMemo } from 'react';
import { HealthIndicator } from '@/components/staff/project-details/health-indicator';
import { Timeline } from '@/components/staff/project-details/timeline';
import { DocumentViewer } from '@/components/staff/project-details/document-viewer';
import { NotesSection } from '@/components/staff/project-details/notes-section';
import { Timestamp } from 'firebase/firestore';
import { ProjectStatus } from '@/lib/types/project';

// Mock data for MVP
const mockProject = {
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
};

// Mock timeline events
const mockTimelineEvents = [
  {
    id: '1',
    title: 'Project Created',
    description: 'Onboarding process initiated',
    timestamp: Timestamp.fromDate(new Date(2025, 2, 1)),
    type: 'status' as const
  },
  {
    id: '2',
    title: 'Contract Uploaded',
    timestamp: Timestamp.fromDate(new Date(2025, 2, 3)),
    type: 'document' as const,
    status: 'completed' as const
  },
  {
    id: '3',
    title: 'ID Document Uploaded',
    timestamp: Timestamp.fromDate(new Date(2025, 2, 5)),
    type: 'document' as const,
    status: 'completed' as const
  },
  {
    id: '4',
    title: 'Company Information Form Completed',
    timestamp: Timestamp.fromDate(new Date(2025, 2, 7)),
    type: 'form' as const,
    status: 'completed' as const
  },
  {
    id: '5',
    title: 'Requirements Form Completed',
    timestamp: Timestamp.fromDate(new Date(2025, 2, 8)),
    type: 'form' as const,
    status: 'completed' as const
  },
  {
    id: '6',
    title: 'Onboarding Call Scheduled',
    description: 'Scheduled for March 15, 2025 at 10:00 AM',
    timestamp: Timestamp.fromDate(new Date(2025, 2, 10)),
    type: 'call' as const,
    status: 'pending' as const
  },
  {
    id: '7',
    title: 'Waiting for Company Registration',
    description: 'Customer has been reminded to upload the document',
    timestamp: Timestamp.fromDate(new Date(2025, 2, 12)),
    type: 'note' as const
  }
];

// Mock documents
const mockDocuments = [
  {
    id: 'doc1',
    name: 'Contract.pdf',
    type: 'pdf',
    url: 'https://example.com/contract.pdf',
    uploadedAt: new Date(2025, 2, 3),
    size: 2500000
  },
  {
    id: 'doc2',
    name: 'ID Document.jpg',
    type: 'image',
    url: 'https://example.com/id.jpg',
    uploadedAt: new Date(2025, 2, 5),
    size: 1200000
  }
];

// Mock notes
const mockNotes = [
  {
    id: 'note1',
    content: 'Customer requested expedited onboarding process due to upcoming product launch.',
    createdAt: new Date(2025, 2, 2),
    createdBy: 'John Doe'
  },
  {
    id: 'note2',
    content: 'Followed up with customer about missing company registration document. They promised to send it by end of week.',
    createdAt: new Date(2025, 2, 12),
    createdBy: 'Jane Smith'
  }
];

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format date for display
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{mockProject.customerName}</h1>
          <p className="text-gray-600">{mockProject.companyName}</p>
        </div>
        
        <HealthIndicator status={mockProject.status} size="lg" />
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'forms'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            onClick={() => setActiveTab('forms')}
          >
            Forms
          </button>
          <button
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'notes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            onClick={() => setActiveTab('notes')}
          >
            Internal Notes
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="px-6 py-5 border-b">
                <h2 className="text-lg font-medium">Onboarding Progress</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Overall Progress</span>
                    <span className="font-medium">{mockProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        mockProject.progress < 30 ? 'bg-red-500' : 
                        mockProject.progress < 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${mockProject.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <Timeline events={mockTimelineEvents} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-6 py-5 border-b">
                  <h2 className="text-lg font-medium">Project Details</h2>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd className="mt-1">{formatDate(mockProject.startDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Progress</dt>
                      <dd className="mt-1">{mockProject.progress}%</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${mockProject.status === 'On Track' ? 'bg-green-100 text-green-800' : 
                            mockProject.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'}
                        `}>
                          {mockProject.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Scheduled Call</dt>
                      <dd className="mt-1">
                        {mockProject.callScheduled 
                          ? formatDate(mockProject.callScheduled)
                          : 'None scheduled'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Documents</dt>
                      <dd className="mt-1">
                        {mockProject.documents.uploaded.length} of {mockProject.documents.required.length} uploaded
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Forms</dt>
                      <dd className="mt-1">
                        {mockProject.forms.completed.length} of {mockProject.forms.required.length} completed
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-6 py-5 border-b">
                  <h2 className="text-lg font-medium">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {mockTimelineEvents.slice(0, 3).map(event => (
                      <li key={event.id} className="flex items-start space-x-3">
                        <div className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          ${event.type === 'document' ? 'bg-blue-100 text-blue-800' : 
                            event.type === 'form' ? 'bg-purple-100 text-purple-800' : 
                            event.type === 'call' ? 'bg-yellow-100 text-yellow-800' : 
                            event.type === 'status' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {event.type === 'document' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {event.type === 'form' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                              <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                            </svg>
                          )}
                          {event.type === 'call' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          )}
                          {event.type === 'status' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {event.type === 'note' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(event.timestamp)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <DocumentViewer documents={mockDocuments} />
          </div>
        )}
        
        {activeTab === 'forms' && (
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Form Responses</h2>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Company Information Form</h3>
                <p className="text-sm text-gray-500 mb-2">Completed on {formatDate(Timestamp.fromDate(new Date(2025, 2, 7)))}</p>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                    <dd className="mt-1">Acme Inc.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="mt-1">Technology</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Employees</dt>
                    <dd className="mt-1">250</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Year Founded</dt>
                    <dd className="mt-1">2010</dd>
                  </div>
                </dl>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium">Requirements Form</h3>
                <p className="text-sm text-gray-500 mb-2">Completed on {formatDate(Timestamp.fromDate(new Date(2025, 2, 8)))}</p>
                <dl className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Project Requirements</dt>
                    <dd className="mt-1">We need a comprehensive solution that integrates with our existing CRM system and provides real-time analytics for our sales team. The solution should be scalable to accommodate our growing team and include mobile access.</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Expected Go-Live Date</dt>
                    <dd className="mt-1">April 15, 2025</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
                    <dd className="mt-1">We have a tight deadline due to our upcoming product launch. Our IT team is available to assist with the integration process.</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <NotesSection projectId={projectId} initialNotes={mockNotes} />
          </div>
        )}
      </div>
    </div>
  );
}
