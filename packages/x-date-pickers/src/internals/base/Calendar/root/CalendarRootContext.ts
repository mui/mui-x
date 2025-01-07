import * as React from 'react';
import { PickersTimezone, PickerValidDate } from '../../../../models';
import { ValidateDateProps } from '../../../../validation';
import { PickerValue } from '../../../models';
import type { useCalendarRoot } from './useCalendarRoot';
import type { useCalendarDaysGridBody } from '../days-grid-body/useCalendarDaysGridBody';

export interface CalendarRootContext {
  /**
   * The current value of the calendar.
   */
  value: PickerValue;
  /**
   * Set the current value of the calendar.
   * @param {PickerValue} value The new value of the calendar.
   * @param {Pick<useCalendarRoot.ValueChangeHandlerContext, 'section'>} options The options to customize the behavior of this update.
   */
  setValue: (
    value: PickerValue,
    options: Pick<useCalendarRoot.ValueChangeHandlerContext, 'section'>,
  ) => void;
  /**
   * The reference date of the calendar.
   */
  referenceDate: PickerValidDate;
  timezone: PickersTimezone;
  disabled: boolean;
  readOnly: boolean;
  autoFocus: boolean;
  isDateInvalid: (day: PickerValidDate | null) => boolean;
  validationProps: ValidateDateProps;
  visibleDate: PickerValidDate;
  setVisibleDate: (visibleDate: PickerValidDate, skipIfAlreadyVisible: boolean) => void;
  monthPageSize: number;
  yearPageSize: number;
  applyDayGridKeyboardNavigation: (event: React.KeyboardEvent) => void;
  registerDaysGridCells: (
    cellsRef: useCalendarDaysGridBody.CellsRef,
    rowsRef: useCalendarDaysGridBody.RowsRef,
  ) => () => void;
  registerSection: (parameters: useCalendarRoot.RegisterSectionParameters) => () => void;
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
