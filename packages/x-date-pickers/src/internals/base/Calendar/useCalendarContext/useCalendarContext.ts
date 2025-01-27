import { useBaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';

// TODO: Use a dedicated context
export function useCalendarContext() {
  const baseRootContext = useBaseCalendarRootContext();

  return {
    visibleDate: baseRootContext.visibleDate,
    disabled: baseRootContext.disabled,
  };
}
