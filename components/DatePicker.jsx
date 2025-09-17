'use client'
import React, { useState, useEffect, useRef } from 'react';

const DatePicker = ({ 
  label, 
  value, 
  onChange, 
  minDate, 
  unavailableDates = [], 
  placeholder = "Select date",
  id = "default"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);

  const today = new Date();
  const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const firstDayOfWeek = currentDate.getDay();

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateUnavailable = (date) => {
    const dateStr = formatDate(date);
    const minDateObj = minDate ? new Date(minDate) : today;
    return unavailableDates.includes(dateStr) || date < minDateObj;
  };

  const isDateSelected = (date) => {
    return value === formatDate(date);
  };

  const handleDateClick = (date) => {
    if (!isDateUnavailable(date)) {
      onChange(formatDate(date));
      setIsOpen(false);
    }
  };

  const getDaysInMonth = () => {
    const days = [];
    const daysInMonth = lastDay.getDate();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }
    
    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative" ref={datePickerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value ? new Date(value).toLocaleDateString() : ''}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-700 placeholder-gray-400 cursor-pointer text-sm"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-25 z-[9998]" onClick={() => setIsOpen(false)}></div>
          {/* Calendar */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] p-6 min-w-[320px] max-w-[400px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((date, index) => {
              if (!date) {
                return <div key={index} className="h-12"></div>;
              }

              const isUnavailable = isDateUnavailable(date);
              const isSelected = isDateSelected(date);
              const isToday = formatDate(date) === formatDate(today);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={isUnavailable}
                  className={`
                    h-12 w-12 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                    ${isUnavailable 
                      ? 'bg-red-100 text-red-400 cursor-not-allowed' 
                      : isSelected
                      ? 'bg-yellow-500 text-white shadow-md'
                      : isToday
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 rounded"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DatePicker;
