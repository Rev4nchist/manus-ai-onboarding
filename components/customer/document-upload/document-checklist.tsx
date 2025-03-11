'use client';

import React from 'react';

interface Document {
  name: string;
  required: boolean;
  uploaded: boolean;
  description?: string;
}

interface DocumentChecklistProps {
  documents: Document[];
  onSelect?: (documentName: string) => void;
}

export function DocumentChecklist({ documents, onSelect }: DocumentChecklistProps) {
  return (
    <div className="bg-white border rounded-md">
      <h3 className="text-lg font-medium p-4 border-b">Required Documents</h3>
      <ul className="divide-y">
        {documents.map((doc, index) => (
          <li 
            key={index} 
            className={`p-4 flex items-center justify-between ${onSelect ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onClick={() => onSelect && onSelect(doc.name)}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                doc.uploaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {doc.uploaded ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">{doc.name}</p>
                {doc.description && (
                  <p className="text-sm text-gray-500">{doc.description}</p>
                )}
              </div>
            </div>
            <div>
              {doc.required && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Required
                </span>
              )}
              {doc.uploaded && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                  Uploaded
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
