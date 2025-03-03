import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { ClockPrecision, ClockSection } from './types';

export interface ClockOptionListContext {
  /**
   * Return true if the option should be reachable using tab navigation.
   * @param {PickerValidDate} option The option to check.
   * @returns {boolean} Whether the option should be reachable using tab navigation.
   */
  canOptionBeTabbed: (option: PickerValidDate) => boolean;
  /**
   * Determine if the given option is selected.
   * @param {PickerValidDate} option The option to check.
   * @returns  {boolean} Whether the option is selected.
   */
  isOptionSelected: (option: PickerValidDate) => boolean;
  /**
   * The section handled by the component.
   */
  section: ClockSection;
  /**
   * The precision of the component.
   */
  precision: ClockPrecision;
  /**
   * The format to use for the options if none is provided.
   */
  defaultFormat: string;
}

export const ClockOptionListContext = React.createContext<ClockOptionListContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  ClockOptionListContext.displayName = 'ClockOptionListContext';
}

export function useClockOptionListContext() {
  const context = React.useContext(ClockOptionListContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: ClockOptionListContext is missing.',
        '<Clock.Option /> must be placed within <Clock.Options /> or a more specific component like <Clock.MinuteOptions />.',
      ].join('\n'),
    );
  }
  return context;
}
