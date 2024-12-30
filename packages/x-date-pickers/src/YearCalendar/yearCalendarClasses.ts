import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface YearCalendarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the button element that represents a single year */
  button: string;
  /** Styles applied to a disabled button element. */
  disabled: string;
  /** Styles applied to a selected button element. */
  selected: string;
}

export type YearCalendarClassKey = keyof YearCalendarClasses;

export function getYearCalendarUtilityClass(slot: string) {
  return generateUtilityClass('MuiYearCalendar', slot);
}

export const yearCalendarClasses = generateUtilityClasses('MuiYearCalendar', [
  'root',
  'button',
  'disabled',
  'selected',
]);
