import { useCalendarRootContext } from '../root/CalendarRootContext';

// TODO: Use a dedicated context
export function useCalendarContext() {
  const rootContext = useCalendarRootContext();

  return {
    visibleDate: rootContext.visibleDate,
  };
}
