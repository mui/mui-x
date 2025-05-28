import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DateCalendarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the transition group element. */
  viewTransitionContainer: string;
}

export type DateCalendarClassKey = keyof DateCalendarClasses;

export const getDateCalendarUtilityClass = (slot: string) =>
  generateUtilityClass('MuiDateCalendar', slot);

export const dateCalendarClasses: DateCalendarClasses = generateUtilityClasses('MuiDateCalendar', [
  'root',
  'viewTransitionContainer',
]);
