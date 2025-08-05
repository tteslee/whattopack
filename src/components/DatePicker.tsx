'use client';

import { useState, useRef, useEffect } from 'react';
import { Popover } from '@headlessui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  id: string;
  name: string;
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  required?: boolean;
}

export default function DatePicker({
  id,
  name,
  label,
  selected,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  required = false
}: DatePickerProps) {
  // Set default min date and max date for Open-Meteo API valid range
  const defaultMinDate = minDate || new Date('2025-05-03');
  const defaultMaxDate = maxDate || new Date('2025-08-19');
  
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const [isOpen, setIsOpen] = useState(false);

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return placeholder;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (date: Date, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onChange(date);
    setIsOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    if (defaultMinDate && date < defaultMinDate) return true;
    if (defaultMaxDate && date > defaultMaxDate) return true;
    return false;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-subway-text-light dark:text-subway-text mb-2">
        {label}
      </label>
      
      <Popover className="relative">
        <Popover.Button className="w-full px-4 py-3 rounded-lg bg-subway-surface-light dark:bg-subway-surface border border-subway-muted-light dark:border-subway-muted text-subway-text-light dark:text-subway-text hover:border-subway-a focus:border-subway-a focus:outline-none transition-colors text-left">
          {formatDateForDisplay(selected)}
        </Popover.Button>

        <Popover.Panel className="absolute z-50 mt-2 w-80 bg-subway-card-light dark:bg-subway-card border border-subway-muted-light dark:border-subway-muted rounded-2xl shadow-xl">
          <div className="p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevMonth();
                }}
                className="p-2 rounded-lg hover:bg-subway-surface-light dark:hover:bg-subway-surface transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-subway-text-light dark:text-subway-text" />
              </button>
              
              <h3 className="text-lg font-semibold text-subway-text-light dark:text-subway-text">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextMonth();
                }}
                className="p-2 rounded-lg hover:bg-subway-surface-light dark:hover:bg-subway-surface transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-subway-text-light dark:text-subway-text" />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-subway-muted-light dark:text-subway-muted py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div key={index} className="text-center">
                  {day ? (
                    <button
                      type="button"
                      onClick={(e) => handleDateSelect(day, e)}
                      disabled={isDateDisabled(day)}
                      className={`
                        w-10 h-10 rounded-lg text-sm font-medium transition-colors
                        ${isDateDisabled(day) 
                          ? 'text-subway-muted-light dark:text-subway-muted cursor-not-allowed' 
                          : selected && isSameDay(day, selected)
                          ? 'bg-subway-a text-white'
                          : 'text-subway-text-light dark:text-subway-text hover:bg-subway-surface-light dark:hover:bg-subway-surface'
                        }
                      `}
                    >
                      {day.getDate()}
                    </button>
                  ) : (
                    <div className="w-10 h-10" />
                  )}
                </div>
              ))}
            </div>

            {/* Today Button */}
            <div className="mt-4 pt-4 border-t border-subway-muted-light dark:border-subway-muted">
              <button
                type="button"
                onClick={(e) => handleDateSelect(new Date(), e)}
                disabled={isDateDisabled(new Date())}
                className="w-full px-4 py-2 text-sm font-medium text-subway-a hover:bg-subway-surface-light dark:hover:bg-subway-surface rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Today
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Popover>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={formatDateForInput(selected)}
        required={required}
      />
    </div>
  );
} 