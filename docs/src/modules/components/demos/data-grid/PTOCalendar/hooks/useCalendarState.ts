import * as React from 'react';
import { addMonths, subMonths } from 'date-fns';
import { FilterType } from '../types/pto';
import { DATE_CONSTRAINTS } from '../constants';

export const useCalendarState = () => {
  const [density, setDensity] = React.useState<'compact' | 'comfortable'>('compact');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<FilterType[]>([
    'holidays',
    'vacation',
    'sick',
  ]);
  const [showPresentToday, setShowPresentToday] = React.useState(false);

  const handlePreviousMonth = React.useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = subMonths(prev, 1);
      return newDate >= DATE_CONSTRAINTS.minDate ? newDate : prev;
    });
  }, []);

  const handleNextMonth = React.useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = addMonths(prev, 1);
      return newDate <= DATE_CONSTRAINTS.maxDate ? newDate : prev;
    });
  }, []);

  const handleDateChange = React.useCallback((newDate: Date | null) => {
    if (newDate && newDate >= DATE_CONSTRAINTS.minDate && newDate <= DATE_CONSTRAINTS.maxDate) {
      setCurrentDate(newDate);
      setIsDatePickerOpen(false);
    }
  }, []);

  const handleFilterRemove = React.useCallback((filter: FilterType) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  }, []);

  const handleFilterAdd = React.useCallback((filter: FilterType) => {
    setActiveFilters((prev) => [...prev, filter]);
  }, []);

  const handleTogglePresentToday = React.useCallback(() => {
    setShowPresentToday((prev) => !prev);
  }, []);

  return {
    density,
    setDensity,
    currentDate,
    isDatePickerOpen,
    setIsDatePickerOpen,
    activeFilters,
    showPresentToday,
    dateConstraints: DATE_CONSTRAINTS,
    handlePreviousMonth,
    handleNextMonth,
    handleDateChange,
    handleFilterRemove,
    handleFilterAdd,
    handleTogglePresentToday,
  };
};
