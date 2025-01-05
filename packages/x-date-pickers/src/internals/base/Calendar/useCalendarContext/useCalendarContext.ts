import { useCalendarRootContext } from '../root/CalendarRootContext';

// TODO: Use a dedicated context
export function useCalendarContext() {
  const calendarRootContext = useCalendarRootContext();

  return {
    visibleDate: calendarRootContext.visibleDate,
    setVisibleDate: calendarRootContext.setVisibleDate,
  };
}
