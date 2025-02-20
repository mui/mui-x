import * as React from 'react';
import { PickersTimezone, PickerValidDate } from '../../../../models';
import { ValidateTimeProps } from '../../../../validation';
import { ClockSection } from '../utils/types';

export interface ClockRootContext {
  /**
   * The timezone to use when rendering or interactive with the dates.
   */
  timezone: PickersTimezone;
  /**
   * Whether the calendar is disabled.
   */
  disabled: boolean;
  /**
   * Whether the calendar is read-only.
   */
  readOnly: boolean;
  /**
   * The props to check if a time is valid or not.
   */
  validationProps: ValidateTimeProps;
  /**
   * The currently selected value.
   */
  value: PickerValidDate | null;
  /**
   * Update the currently selected value.
   * @param {PickerValidDate} value The value to select.
   * @param {object} options The options to select the date.
   * @param {ClockSection | "unknown"} options.section The section handled by the UI that triggered the change.
   */
  setValue: (value: PickerValidDate, options: { section: ClockSection | 'unknown' }) => void;
}

export const ClockRootContext = React.createContext<ClockRootContext | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  ClockRootContext.displayName = 'ClockRootContext';
}

export function useClockRootContext() {
  const context = React.useContext(ClockRootContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: ClockRootContext is missing.',
        'Clock parts must be placed within <Clock.Root />.',
      ].join('\n'),
    );
  }
  return context;
}
