'use client';

import React, { useState, useEffect } from 'react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface CalendarPickerProps {
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (slot: TimeSlot) => void;
  disabledDates?: (date: Date) => boolean;
}

export function CalendarPicker({
  onDateSelect,
  onTimeSelect,
  disabledDates
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // Generate calendar days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    
    if (onDateSelect) {
      onDateSelect(date);
    }
    
    // Fetch available slots for the selected date
    // In a real app, this would come from an API or Firestore
    fetchAvailableSlots(date);
  };
  
  // Fetch available slots for a date
  const fetchAvailableSlots = (date: Date) => {
    // Mock data for MVP
    const mockSlots = [
      { id: '1', time: '09:00 AM', available: true },
      { id: '2', time: '10:00 AM', available: true },
      { id: '3', time: '11:00 AM', available: false },
      { id: '4', time: '01:00 PM', available: true },
      { id: '5', time: '02:00 PM', available: true },
      { id: '6', time: '03:00 PM', available: false },
      { id: '7', time: '04:00 PM', available: true },
    ];
    
    setAvailableSlots(mockSlots);
  };
  
  // Handle time slot selection
  const handleTimeSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    
    setSelectedSlot(slot);
    
    if (onTimeSelect) {
      onTimeSelect(slot);
    }
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Check if a date is disabled
  const isDateDisabled = (date: Date) => {
    // Default: disable past dates and weekends
    if (!date) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isPast = date < today;
    
    // Use custom disabledDates function if provided
    if (disabledDates) {
      return disabledDates(date) || isWeekend || isPast;
    }
    
    return isWeekend || isPast;
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calendarDays = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border shadow-sm">
        {/* Calendar header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <h3 className="text-lg font-medium">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Calendar grid */}
        <div className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div key={index} className="aspect-square">
                {day ? (
                  <button
                    className={`
                      w-full h-full flex items-center justify-center rounded-full
                      ${isDateDisabled(day) 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : selectedDate && day.getTime() === selectedDate.getTime()
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                      }
                    `}
                    disabled={isDateDisabled(day)}
                    onClick={() => !isDateDisabled(day) && handleDateSelect(day)}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Time slots */}
      {selectedDate && (
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <h3 className="text-lg font-medium mb-4">
            Available Times for {formatDate(selectedDate)}
          </h3>
          
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot.id}
                  className={`
                    p-3 text-center rounded-md transition-colors
                    ${!slot.available 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : selectedSlot?.id === slot.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }
                  `}
                  disabled={!slot.available}
                  onClick={() => handleTimeSelect(slot)}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Loading available times...</p>
          )}
        </div>
      )}
    </div>
  );
}
