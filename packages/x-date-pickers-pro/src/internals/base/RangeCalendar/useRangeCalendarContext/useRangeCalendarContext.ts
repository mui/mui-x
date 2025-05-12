// eslint-disable-next-line no-restricted-imports
import {
  BaseCalendarRootContext,
  useBaseCalendarRootContext,
} from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/BaseCalendarRootContext';
// eslint-disable-next-line no-restricted-imports
import {
  BaseCalendarRootVisibleDateContext,
  useBaseCalendarRootVisibleDateContext,
} from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/BaseCalendarRootVisibleDateContext';

// TODO: Use a dedicated context
export function useRangeCalendarContext() {
  const baseRootContext = useBaseCalendarRootContext();
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();

  return {
    visibleDate: baseRootVisibleDateContext.visibleDate,
    disabled: baseRootContext.disabled,
  };
}

export namespace useRangeCalendarContext {
  export interface ReturnValue
    extends Pick<BaseCalendarRootContext, 'disabled'>,
      Pick<BaseCalendarRootVisibleDateContext, 'visibleDate'> {}
}
