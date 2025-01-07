import * as React from 'react';
import { PickerNonNullableRangeValue, PickerRangeValue } from '@mui/x-date-pickers/internals';
// eslint-disable-next-line no-restricted-imports
import { useBaseCalendarRoot } from '@mui/x-date-pickers/internals/base/utils/base-calendar/root/useBaseCalendarRoot';
import { ValidateDateRangeProps } from '../../../../validation';

export interface RangeCalendarRootContext {
  /**
   * The current value of the calendar.
   */
  value: PickerRangeValue;
  /**
   * Set the current value of the calendar.
   * @param {PickerRangeValue} value The new value of the calendar.
   * @param {Pick<useBaseCalendarRoot.ValueChangeHandlerContext<PickerRangeValue>, 'section'>} options The options to customize the behavior of this update.
   */
  setValue: (
    value: PickerRangeValue,
    options: Pick<useBaseCalendarRoot.ValueChangeHandlerContext<PickerRangeValue>, 'section'>,
  ) => void;
  referenceValue: PickerNonNullableRangeValue;
  validationProps: ValidateDateRangeProps;
}

export const RangeCalendarRootContext = React.createContext<RangeCalendarRootContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  RangeCalendarRootContext.displayName = 'RangeCalendarRootContext';
}

export function useCalendarRootContext() {
  const context = React.useContext(RangeCalendarRootContext);
  if (context === undefined) {
    throw new Error(
      'Base UI X: RangeCalendarRootContext is missing. Range Calendar parts must be placed within <RangeCalendar.Root />.',
    );
  }
  return context;
}
