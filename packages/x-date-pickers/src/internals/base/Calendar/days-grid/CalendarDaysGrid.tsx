'use client';
import * as React from 'react';
import { useCalendarRootContext } from '../root/CalendarRootContext';

const CalendarDaysGrid: React.FC<CalendarDaysGrid.Props> = function CalendarDaysGrid() {
  const calendarRootContext = useCalendarRootContext();

  if (calendarRootContext.activeSection !== 'day') {
    return null;
  }

  return <div>Days view not implemented yet</div>;
};

export namespace CalendarDaysGrid {
  export interface State {}

  export interface Props {}
}

export { CalendarDaysGrid };
