import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface CalendarRangePickerClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the container of a single month element. */
  container: string;
}

export type CalendarRangePickerClassKey = keyof CalendarRangePickerClasses;

export const getCalendarRangePickerUtilityClass = (slot: string) =>
  generateUtilityClass('MuiCalendarRangePicker', slot);

export const calendarRangePickerClasses: CalendarRangePickerClasses = generateUtilityClasses(
  'MuiCalendarRangePicker',
  ['root', 'container'],
);
