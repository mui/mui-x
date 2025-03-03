import { useBaseCalendarRootContext } from '../../utils/base-calendar/root/BaseCalendarRootContext';
import { useBaseCalendarRootVisibleDateContext } from '../../utils/base-calendar/root/BaseCalendarRootVisibleDateContext';

// TODO: Use a dedicated context
export function useCalendarContext() {
  const baseRootContext = useBaseCalendarRootContext();
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();

  return {
    visibleDate: baseRootVisibleDateContext.visibleDate,
    disabled: baseRootContext.disabled,
  };
}
