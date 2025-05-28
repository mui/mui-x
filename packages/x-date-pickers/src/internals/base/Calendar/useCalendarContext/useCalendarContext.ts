import {
  BaseCalendarRootContext,
  useBaseCalendarRootContext,
} from '../../utils/base-calendar/root/BaseCalendarRootContext';
import {
  BaseCalendarRootVisibleDateContext,
  useBaseCalendarRootVisibleDateContext,
} from '../../utils/base-calendar/root/BaseCalendarRootVisibleDateContext';

// TODO: Use a dedicated context
export function useCalendarContext(): useCalendarContext.ReturnValue {
  const baseRootContext = useBaseCalendarRootContext();
  const baseRootVisibleDateContext = useBaseCalendarRootVisibleDateContext();

  return {
    visibleDate: baseRootVisibleDateContext.visibleDate,
    disabled: baseRootContext.disabled,
  };
}

export namespace useCalendarContext {
  export interface ReturnValue
    extends Pick<BaseCalendarRootContext, 'disabled'>,
      Pick<BaseCalendarRootVisibleDateContext, 'visibleDate'> {}
}
