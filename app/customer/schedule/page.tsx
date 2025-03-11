'use client';

import { useState } from 'react';
import { CalendarPicker } from '@/components/customer/scheduling/calendar-picker';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };
  
  const handleTimeSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };
  
  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) return;
    
    try {
      setIsBooking(true);
      
      // In a real app, this would save to Firestore
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsBooked(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setIsBooking(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Schedule Onboarding Call</h1>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
        <p className="text-gray-600 mb-6">
          Schedule a call with our onboarding team to discuss your requirements and next steps.
          Please select a date and time that works for you.
        </p>
        
        {isBooked ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Appointment Scheduled!</h2>
            <p className="mb-4">
              Your onboarding call has been scheduled for {selectedDate && formatDate(selectedDate)} at {selectedSlot?.time}.
            </p>
            <p className="text-sm text-gray-500">
              You will receive a confirmation email with meeting details shortly.
            </p>
            <button
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setIsBooked(false)}
            >
              Schedule Another Call
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
              <CalendarPicker 
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
                disabledDates={(date) => {
                  // Example: disable specific dates
                  const disabledDates = [new Date(2025, 2, 15), new Date(2025, 2, 16)];
                  return disabledDates.some(d => 
                    d.getFullYear() === date.getFullYear() && 
                    d.getMonth() === date.getMonth() && 
                    d.getDate() === date.getDate()
                  );
                }}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Appointment Summary</h2>
              <div className="bg-gray-50 p-6 rounded-lg border h-full">
                {selectedDate && selectedSlot ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date</h3>
                      <p className="text-lg">{formatDate(selectedDate)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Time</h3>
                      <p className="text-lg">{selectedSlot.time}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Meeting Type</h3>
                      <p className="text-lg">Onboarding Call (30 minutes)</p>
                    </div>
                    
                    <button
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                      onClick={handleBookAppointment}
                      disabled={isBooking}
                    >
                      {isBooking ? 'Scheduling...' : 'Schedule Call'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">
                      Please select a date and time to schedule your onboarding call.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
