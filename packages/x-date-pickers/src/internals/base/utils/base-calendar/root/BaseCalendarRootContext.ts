import * as React from 'react';
import { PickersTimezone, PickerValidDate } from '../../../../../models';
import { ValidateDateProps } from '../../../../../validation';
import type { useBaseCalendarRoot } from './useBaseCalendarRoot';
import type { useBaseCalendarDaysGridBody } from '../days-grid-body/useBaseCalendarDaysGridBody';

export interface BaseCalendarRootContext {
  timezone: PickersTimezone;
  disabled: boolean;
  readOnly: boolean;
  autoFocus: boolean;
  isDateInvalid: (day: PickerValidDate | null) => boolean;
  dateValidationProps: ValidateDateProps;
  visibleDate: PickerValidDate;
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
