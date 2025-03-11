'use client';

import React, { useState, useCallback } from 'react';

interface UploadFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  
  // Handle file selection
  const handleFileSelect = useCallback((files: FileList) => {
    // Convert FileList to array and process each file
    const fileArray = Array.from(files);
    
    // Create new upload objects
    const newUploads = fileArray.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading' as const
    }));
    
    // Add to uploads state
    setUploads(prev => [...prev, ...newUploads]);
    
    // Simulate upload progress for each file
    // In a real app, this would be replaced with actual Firebase Storage uploads
    newUploads.forEach(upload => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploads(prev => 
            prev.map(u => 
              u.id === upload.id 
                ? { ...u, progress: 100, status: 'success' } 
                : u
            )
          );
        } else {
          setUploads(prev => 
            prev.map(u => 
              u.id === upload.id 
                ? { ...u, progress } 
                : u
            )
          );
        }
      }, 500);
    });
  }, []);
  
  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);
  
  // Handle file removal
  const handleRemove = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  };
  
  return (
    <div className="space-y-6">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          hover:border-blue-500 hover:bg-blue-50
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div>
            <p className="text-lg font-medium">Drag and drop files here</p>
            <p className="text-sm text-gray-500">or click to browse</p>
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Select Files
          </button>
          <input 
            id="file-input" 
            type="file" 
            multiple 
            className="hidden" 
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </div>
      </div>
      
      {uploads.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploads</h3>
          <div className="space-y-2">
            {uploads.map((file) => (
              <div key={file.id} className="bg-white p-4 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => handleRemove(file.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${file.status === 'error' ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <span className="text-xs font-medium">
                    {file.status === 'uploading' && `${Math.round(file.progress)}%`}
                    {file.status === 'success' && 'Complete'}
                    {file.status === 'error' && 'Failed'}
                  </span>
                </div>
                {file.error && (
                  <p className="text-xs text-red-500 mt-1">{file.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
