import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export function getMonthCalendarUtilityClass(slot: string) {
  return generateUtilityClass('MuiMonthCalendar', slot);
}

export interface MonthCalendarClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type MonthCalendarClassKey = keyof MonthCalendarClasses;

export const monthCalendarClasses = generateUtilityClasses<MonthCalendarClassKey>(
  'MuiMonthCalendar',
  ['root'],
);
