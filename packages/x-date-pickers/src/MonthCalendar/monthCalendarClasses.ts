import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export function getMonthCalendarUtilityClass(slot: string) {
  return generateUtilityClass('MuiMonthCalendar', slot);
}

export interface MonthCalendarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the button element that represents a single month */
  button: string;
  /** Styles applied to a disabled button element. */
  disabled: string;
  /** Styles applied to a selected button element. */
  selected: string;
}

export type MonthCalendarClassKey = keyof MonthCalendarClasses;

export const monthCalendarClasses = generateUtilityClasses<MonthCalendarClassKey>(
  'MuiMonthCalendar',
  ['root', 'button', 'disabled', 'selected'],
);
