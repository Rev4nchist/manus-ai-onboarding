'use client';

import React from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  size: number;
}

interface DocumentViewerProps {
  documents: Document[];
}

export function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(
    documents.length > 0 ? documents[0] : null
  );
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get icon based on file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Document list */}
      <div className="md:col-span-1 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="text-sm font-medium text-gray-700">Documents</h3>
        </div>
        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {documents.map((doc) => (
            <li 
              key={doc.id}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                selectedDocument?.id === doc.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedDocument(doc)}
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(doc.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
          
          {documents.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-500">
              No documents available
            </li>
          )}
        </ul>
      </div>
      
      {/* Document preview */}
      <div className="md:col-span-2 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">
            {selectedDocument ? selectedDocument.name : 'Document Preview'}
          </h3>
          {selectedDocument && (
            <a 
              href={selectedDocument.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Download
            </a>
          )}
        </div>
        <div className="bg-gray-100 h-96 flex items-center justify-center">
          {selectedDocument ? (
            selectedDocument.type.toLowerCase() === 'pdf' ? (
              <div className="w-full h-full">
                <iframe 
                  src={`${selectedDocument.url}#view=FitH`} 
                  className="w-full h-full" 
                  title={selectedDocument.name}
                />
              </div>
            ) : ['image', 'jpg', 'jpeg', 'png'].includes(selectedDocument.type.toLowerCase()) ? (
              <img 
                src={selectedDocument.url} 
                alt={selectedDocument.name} 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center p-6">
                {getFileIcon(selectedDocument.type)}
                <p className="mt-2 text-gray-600">Preview not available</p>
                <a 
                  href={selectedDocument.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Open Document
                </a>
              </div>
            )
          ) : (
            <p className="text-gray-500">Select a document to preview</p>
          )}
        </div>
      </div>
    </div>
  );
}
