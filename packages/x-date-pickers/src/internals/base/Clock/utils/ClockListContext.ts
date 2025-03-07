import * as React from 'react';
import { PickerValidDate } from '../../../../models';
import { ClockPrecision, ClockSection } from './types';

export interface ClockListContext {
  /**
   * Return true if the item should be reachable using tab navigation.
   * @param {PickerValidDate} item The item to check.
   * @returns {boolean} Whether the item should be reachable using tab navigation.
   */
  canItemBeTabbed: (item: PickerValidDate) => boolean;
  /**
   * Determine if the given item is selected.
   * @param {PickerValidDate} item The item to check.
   * @returns  {boolean} Whether the item is selected.
   */
  isItemSelected: (item: PickerValidDate) => boolean;
  /**
   * The section handled by the component.
   */
  section: ClockSection;
  /**
   * The precision of the component.
   */
  precision: ClockPrecision;
  /**
   * The format to use for the item if none is provided.
   */
  defaultFormat: string;
}

export const ClockListContext = React.createContext<ClockListContext | undefined>(undefined);

if (process.env.NODE_ENV !== 'production') {
  ClockListContext.displayName = 'ClockListContext';
}

export function useClockListContext() {
  const context = React.useContext(ClockListContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: ClockListContext is missing.',
        '<Clock.Cell /> must be placed within <Clock.FullTimeList /> or a more specific component like <Clock.MinuteList />.',
      ].join('\n'),
    );
  }
  return context;
}
