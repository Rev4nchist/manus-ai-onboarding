'use client';

import React, { useState } from 'react';

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

interface NotesProps {
  projectId: string;
  initialNotes?: Note[];
}

export function NotesSection({ projectId, initialNotes = [] }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Add new note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would save to Firestore
      // For MVP, we'll just add it to the local state
      const note: Note = {
        id: `note-${Date.now()}`,
        content: newNote,
        createdAt: new Date(),
        createdBy: 'Staff Member'
      };
      
      setNotes([note, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Add note form */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-3">Add Internal Note</h3>
        <div className="space-y-3">
          <textarea
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Add a note about this project..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              onClick={handleAddNote}
              disabled={isSubmitting || !newNote.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Notes list */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="text-sm font-medium text-gray-700">Internal Notes</h3>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="p-4">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-900">{note.createdBy}</p>
                <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No notes yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
