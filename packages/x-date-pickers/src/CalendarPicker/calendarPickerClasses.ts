import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

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
