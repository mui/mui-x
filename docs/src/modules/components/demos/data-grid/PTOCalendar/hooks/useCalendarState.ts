import { useState, useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { FilterType } from '../types/pto';
import { DATE_CONSTRAINTS, DEMO_YEAR } from '../constants';
import { isWithinDemoYear } from '../utils/dateUtils';

export const useCalendarState = () => {
  const [currentDate, setCurrentDate] = useState(new Date(DEMO_YEAR, 4, 1));
  const [searchQuery, setSearchQuery] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(['holidays', 'vacation', 'sick']);

  const handlePreviousMonth = useCallback(() => {
    const newDate = subMonths(currentDate, 1);
    if (isWithinDemoYear(newDate)) {
      setCurrentDate(newDate);
    }
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    const newDate = addMonths(currentDate, 1);
    if (isWithinDemoYear(newDate)) {
      setCurrentDate(newDate);
    }
  }, [currentDate]);

  const handleDateChange = useCallback((newDate: Date | null) => {
    if (newDate && isWithinDemoYear(newDate)) {
      setCurrentDate(newDate);
      setIsDatePickerOpen(false);
    }
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleFilterRemove = useCallback((filter: FilterType) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  }, []);

  const handleFilterAdd = useCallback((filter: FilterType) => {
    setActiveFilters(prev => [...prev, filter]);
  }, []);

  return {
    currentDate,
    searchQuery,
    isDatePickerOpen,
    activeFilters,
    dateConstraints: DATE_CONSTRAINTS,
    handlePreviousMonth,
    handleNextMonth,
    handleDateChange,
    handleSearchChange,
    handleFilterRemove,
    handleFilterAdd,
    setIsDatePickerOpen
  };
}; 