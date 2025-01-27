// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarRootContext } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/BaseCalendarRootContext';

// TODO: Use a dedicated context
export function useRangeCalendarContext() {
  const baseRootContext = useBaseCalendarRootContext();

  return {
    visibleDate: baseRootContext.visibleDate,
    disabled: baseRootContext.disabled,
  };
}
