import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { ValidateTimeProps } from '../../../../validation';
import { ClockPrecision, ClockSection } from '../utils/types';

export interface ClockRootContext {
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
  validationProps: Omit<ValidateTimeProps, 'disablePast' | 'disableFuture'>;
  /**
   * The currently selected value.
   */
  value: PickerValidDate | null;
  /**
   * Update the currently selected value.
   * @param {PickerValidDate} value The value to select.
   * @param {object} options The options to select the date.
   * @param {ClockSection} options.section The section handled by the UI that triggered the change.
   */
  setValue: (value: PickerValidDate, options: { section: ClockSection }) => void;
  /**
   * The reference date used to generate the cell's value when no value is selected.
   */
  referenceDate: PickerValidDate;
  /**
   * Determine if the given item is invalid.
   * @param {PickerValidDate} item The item to check.
   * @param {ClockPrecision} precision The precision of the item.
   * @returns {boolean} Whether the item is invalid.
   */
  isItemInvalid: (item: PickerValidDate, precision: ClockPrecision) => boolean;
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
