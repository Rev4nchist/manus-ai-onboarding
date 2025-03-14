'use client';

import React from 'react';
import { Timestamp } from 'firebase/firestore';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: Timestamp;
  type: 'document' | 'form' | 'call' | 'status' | 'note';
  status?: 'completed' | 'pending' | 'in-progress';
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    b.timestamp.toMillis() - a.timestamp.toMillis()
  );
  
  // Format date for display
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time for display
  const formatTime = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get icon based on event type
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'form':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
          </svg>
        );
      case 'call':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        );
      case 'status':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'note':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  // Get color based on event type and status
  const getEventColor = (type: TimelineEvent['type'], status?: TimelineEvent['status']) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-gray-100 text-gray-800';
    
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'form': return 'bg-purple-100 text-purple-800';
      case 'call': return 'bg-yellow-100 text-yellow-800';
      case 'status': return 'bg-green-100 text-green-800';
      case 'note': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedEvents.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== sortedEvents.length - 1 ? (
                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className={`relative ${getEventColor(event.type, event.status)} p-2 rounded-full`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="min-w-0 flex-1 py-1.5">
                  <div className="text-sm text-gray-500">
                    <div className="font-medium text-gray-900">
                      {event.title}
                    </div>
                    {event.description && (
                      <p className="mt-1 text-gray-500">
                        {event.description}
                      </p>
                    )}
                    <span className="whitespace-nowrap text-sm text-gray-500">
                      {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
