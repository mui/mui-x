import * as React from 'react';
import { PickersTimezone } from '../../../../models';
import { ValidateTimeProps } from '../../../../validation';

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
