import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface CalendarPickerClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the transition group element. */
  viewTransitionContainer: string;
}

export type CalendarPickerClassKey = keyof CalendarPickerClasses;

export const getCalendarPickerUtilityClass = (slot: string) =>
  generateUtilityClass('MuiCalendarPicker', slot);

export const calendarPickerClasses: CalendarPickerClasses = generateUtilityClasses(
  'MuiCalendarPicker',
  ['root', 'viewTransitionContainer'],
);
