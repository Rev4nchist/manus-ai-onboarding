'use client';

import React from 'react';
import Link from 'next/link';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  variant?: 'default' | 'outline';
}

export function ActionCard({
  title,
  description,
  icon,
  href,
  variant = 'default'
}: ActionCardProps) {
  return (
    <Link href={href}>
      <div className={`
        p-6 rounded-lg transition-all duration-200 cursor-pointer
        ${variant === 'default' 
          ? 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300' 
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}
      `}>
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ActionButtonsProps {
  documentProgress: string;
  formProgress: string;
  callStatus: string;
}

export function ActionButtons({
  documentProgress,
  formProgress,
  callStatus
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ActionCard
        title="Upload Documents"
        description={documentProgress}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        }
        href="/customer/documents"
      />
      
      <ActionCard
        title="Complete Forms"
        description={formProgress}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M9 14l2 2 4-4"></path>
          </svg>
        }
        href="/customer/forms"
      />
      
      <ActionCard
        title="Schedule Call"
        description={callStatus}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        }
        href="/customer/schedule"
      />
    </div>
  );
}
