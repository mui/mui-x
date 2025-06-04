import * as React from 'react';
import { addMonths, subMonths } from 'date-fns';
import { FilterType } from '../types/pto';
import { DATE_CONSTRAINTS, DEMO_YEAR } from '../constants';
import { isWithinDemoYear } from '../utils/dateUtils';

export const useCalendarState = () => {
  const [density, setDensity] = React.useState<'compact' | 'comfortable'>('compact');
  const [currentDate, setCurrentDate] = React.useState(new Date(DEMO_YEAR, 4, 1));
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<FilterType[]>([
    'holidays',
    'vacation',
    'sick',
  ]);

  const handlePreviousMonth = React.useCallback(() => {
    const newDate = subMonths(currentDate, 1);
    if (isWithinDemoYear(newDate)) {
      setCurrentDate(newDate);
    }
  }, [currentDate]);

  const handleNextMonth = React.useCallback(() => {
    const newDate = addMonths(currentDate, 1);
    if (isWithinDemoYear(newDate)) {
      setCurrentDate(newDate);
    }
  }, [currentDate]);

  const handleDateChange = React.useCallback((newDate: Date | null) => {
    if (newDate && isWithinDemoYear(newDate)) {
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

  const value = React.useMemo(
    () => ({
      currentDate,
      density,
      isDatePickerOpen,
      activeFilters,
      dateConstraints: DATE_CONSTRAINTS,
      setDensity,
      setIsDatePickerOpen,
      handleFilterRemove,
      handleFilterAdd,
      handleDateChange,
      handleNextMonth,
      handlePreviousMonth,
    }),
    [
      currentDate,
      isDatePickerOpen,
      activeFilters,
      density,
      setDensity,
      setIsDatePickerOpen,
      handleFilterRemove,
      handleFilterAdd,
      handleDateChange,
      handleNextMonth,
      handlePreviousMonth,
    ],
  );

  return value;
};
