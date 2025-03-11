'use client';

import { UploadZone } from '@/components/customer/document-upload/upload-zone';
import { DocumentChecklist } from '@/components/customer/document-upload/document-checklist';
import { useState } from 'react';

export default function DocumentsPage() {
  // Mock data for MVP
  const [documents, setDocuments] = useState([
    { 
      name: "ID Document", 
      required: true, 
      uploaded: false,
      description: "Government-issued photo ID"
    },
    { 
      name: "Contract", 
      required: true, 
      uploaded: true,
      description: "Signed service agreement"
    },
    { 
      name: "Company Registration", 
      required: true, 
      uploaded: false,
      description: "Official business registration document"
    },
    { 
      name: "Financial Statement", 
      required: false, 
      uploaded: false,
      description: "Most recent annual financial statement"
    },
    { 
      name: "Business Plan", 
      required: false, 
      uploaded: false,
      description: "Current business plan document"
    }
  ]);
  
  const handleDocumentSelect = (documentName: string) => {
    // In a real app, this would trigger document upload for a specific document type
    console.log(`Selected document: ${documentName}`);
    // For demo purposes, open the file dialog
    document.getElementById('file-input')?.click();
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Upload</h1>
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          3 of 5 documents required
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <UploadZone />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
          <DocumentChecklist 
            documents={documents}
            onSelect={handleDocumentSelect}
          />
        </div>
      </div>
    </div>
  );
}
