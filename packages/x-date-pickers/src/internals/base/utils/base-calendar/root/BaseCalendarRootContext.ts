import * as React from 'react';
import { PickersTimezone, PickerValidDate } from '../../../../../models';
import { ValidateDateProps } from '../../../../../validation';
import type { useBaseCalendarRoot } from './useBaseCalendarRoot';
import type { useBaseCalendarDaysGridBody } from '../days-grid-body/useBaseCalendarDaysGridBody';

export interface BaseCalendarRootContext {
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
  // TODO: Implement the behavior.
  /**
   * Whether the calendar should auto-focus on mount.
   */
  autoFocus: boolean;
  /**
   * The date currently visible.
   * It is used to determine:
   * - which month to render in Calendar.DaysGrid and RangeCalendar.DaysGrid
   * - which year to render in Calendar.YearsGrid, Calendar.YearsList, RangeCalendar.YearsGrid, and RangeCalendar.YearsList
   */
  visibleDate: PickerValidDate;
  /**
   * The current date.
   * It is used to determine:
   * - if the rendered cells should be disabled or not
   * - which date to apply when clicking on a cell
   */
  currentDate: PickerValidDate;
  /**
   * The list of currently selected dates.
   * When used inside the Calendar component, it contains the current value if not null.
   * When used inside the RangeCalendar component, it contains the selected start and/or end dates if not null.
   */
  selectedDates: PickerValidDate[];
  /**
   * Selects a date.
   * @param {PickerValidDate} date The date to select.
   * @param {object} options The options to select the date.
   * @param {'day' | 'month' | 'year'} options.section The section handled by the UI that triggered the change.
   */
  selectDate: (date: PickerValidDate, options: { section: 'day' | 'month' | 'year' }) => void;
  /**
   * Determines if the given date is invalid.
   * @param {PickerValidDate} date The date to check.
   * @returns {boolean} Whether the date is invalid.
   */
  isDateInvalid: (date: PickerValidDate) => boolean;
  /**
   * The props to check if a date is valid or not.
   * Warning: Even when used inside the RangeCalendar component, this is still equal to the validation props for a single date.
   */
  dateValidationProps: ValidateDateProps;
  setVisibleDate: (visibleDate: PickerValidDate, skipIfAlreadyVisible: boolean) => void;
  monthPageSize: number;
  yearPageSize: number;
  applyDayGridKeyboardNavigation: (event: React.KeyboardEvent) => void;
  registerDaysGridCells: (
    cellsRef: useBaseCalendarDaysGridBody.CellsRef,
    rowsRef: useBaseCalendarDaysGridBody.RowsRef,
  ) => () => void;
  registerSection: (parameters: useBaseCalendarRoot.RegisterSectionParameters) => () => void;
}

export const BaseCalendarRootContext = React.createContext<BaseCalendarRootContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  BaseCalendarRootContext.displayName = 'BaseCalendarRootContext';
}

export function useBaseCalendarRootContext() {
  const context = React.useContext(BaseCalendarRootContext);
  if (context === undefined) {
    throw new Error(
      [
        'Base UI X: BaseCalendarRootContext is missing.',
        'Calendar parts must be placed within <Calendar.Root /> and Range Calendar parts must be placed within <RangeCalendar.Root />.',
      ].join('\n'),
    );
  }
  return context;
}
