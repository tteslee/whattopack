'use client';

import { useState } from 'react';
import { getPlan } from '@/app/plan/actions';
import { PackingPlan, TemperatureTolerance } from '@/types';
import ResultCard from './ResultCard';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import DatePicker from './DatePicker';

export default function FormCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PackingPlan | null>(null);
  const [selectedTolerance, setSelectedTolerance] = useState<TemperatureTolerance>('neutral');
  // Set default dates to current dates (within valid range)
  const getDefaultDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 5);
    return { start: tomorrow, end: endOfWeek };
  };

  const [startDate, setStartDate] = useState<Date | null>(getDefaultDates().start);
  const [endDate, setEndDate] = useState<Date | null>(getDefaultDates().end);

  const refreshDates = () => {
    const newDates = getDefaultDates();
    setStartDate(newDates.start);
    setEndDate(newDates.end);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Add the selected tolerance and dates to the form data
    formData.append('tolerance', selectedTolerance);
    if (startDate) {
      formData.append('startDate', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      formData.append('endDate', endDate.toISOString().split('T')[0]);
    }

    try {
      const response = await getPlan(formData);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => setError(null)} />;
  }

  if (result) {
    return <ResultCard 
      plan={result} 
      onReset={() => setResult(null)} 
      onRefresh={() => {
        setResult(null);
        refreshDates();
      }}
    />;
  }

  return (
    <div className="rounded-2xl bg-subway-card-light dark:bg-subway-card p-6 shadow-xl max-w-md mx-auto">
      <h2 className="text-h2 font-semibold text-subway-text-light dark:text-subway-text mb-6">
        Plan Your Trip
      </h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }} className="space-y-6">
        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-subway-text-light dark:text-subway-text mb-2">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            placeholder="e.g., New York, Paris"
            className="w-full px-4 py-3 rounded-lg bg-subway-surface-light dark:bg-subway-surface border border-subway-muted-light dark:border-subway-muted text-subway-text-light dark:text-subway-text placeholder-subway-muted-light dark:placeholder-subway-muted focus:border-subway-a focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            id="startDate"
            name="startDate"
            label="Start Date"
            selected={startDate}
            onChange={setStartDate}
            minDate={new Date()}
            placeholder="Select start date"
            required
          />
          <DatePicker
            id="endDate"
            name="endDate"
            label="End Date"
            selected={endDate}
            onChange={setEndDate}
            minDate={startDate || new Date()}
            placeholder="Select end date"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-subway-muted-light dark:text-subway-muted">
            Weather data available for next 16 days
          </p>
          <button
            type="button"
            onClick={refreshDates}
            className="text-xs text-subway-a hover:underline flex items-center gap-1"
          >
            <span className="text-sm">↻</span>
            Refresh dates
          </button>
        </div>

        {/* Temperature Tolerance */}
        <div>
                      <label className="block text-sm font-medium text-subway-text-light dark:text-subway-text mb-3">
            Temperature Tolerance
          </label>
          <div className="space-y-2">
            {[
              { value: 'cold-sensitive' as const, label: 'Cold-sensitive', badge: 'C', color: 'c' as const },
              { value: 'neutral' as const, label: 'Neutral', badge: 'N', color: 'g' as const },
              { value: 'heat-sensitive' as const, label: 'Heat-sensitive', badge: 'H', color: 'b' as const }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="tolerance"
                  value={option.value}
                  checked={selectedTolerance === option.value}
                  onChange={(e) => setSelectedTolerance(e.target.value as TemperatureTolerance)}
                  className="sr-only"
                  required
                />
                <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedTolerance === option.value 
                    ? 'border-subway-a bg-subway-a/10' 
                    : 'border-subway-muted-light dark:border-subway-muted hover:border-subway-a'
                }`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedTolerance === option.value 
                      ? 'border-subway-a bg-subway-a' 
                      : 'border-subway-muted'
                  }`}>
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      selectedTolerance === option.value 
                        ? 'bg-white' 
                        : 'bg-transparent'
                    }`}></div>
                  </div>
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold ${
                    option.color === 'c' ? 'bg-subway-c' :
                    option.color === 'g' ? 'bg-subway-g' :
                    option.color === 'b' ? 'bg-subway-b' : 'bg-subway-a'
                  }`}>
                    {option.badge}
                  </span>
                  <span className="text-subway-text-light dark:text-subway-text font-medium">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-subway-a px-5 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Get your packing list
          <span className="text-2xl leading-none">→</span>
        </button>
      </form>
    </div>
  );
} 