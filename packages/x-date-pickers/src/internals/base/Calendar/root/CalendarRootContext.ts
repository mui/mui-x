import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { PickerValue } from '../../../models';
import { useBaseCalendarRoot } from '../../utils/base-calendar/root/useBaseCalendarRoot';

export interface CalendarRootContext {
  /**
   * The current value of the calendar.
   */
  value: PickerValue;
  /**
   * Set the current value of the calendar.
   * @param {PickerValue} value The new value of the calendar.
   * @param {Pick<useBaseCalendarRoot.ValueChangeHandlerContext<PickerValue>, 'section'>} options The options to customize the behavior of this update.
   */
  setValue: (
    value: PickerValue,
    options: Pick<useBaseCalendarRoot.ValueChangeHandlerContext<PickerValue>, 'section'>,
  ) => void;
  referenceValue: PickerValidDate;
}

export const CalendarRootContext = React.createContext<CalendarRootContext | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  CalendarRootContext.displayName = 'CalendarRootContext';
}

export function useCalendarRootContext() {
  const context = React.useContext(CalendarRootContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: CalendarRootContext is missing. Calendar parts must be placed within <Calendar.Root />.',
    );
  }
  return context;
}
