import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface DayCalendarClasses {
  /** Styles applied to the header element. */
  header: string;
  /** Styles applied to the week day label element. */
  weekDayLabel: string;
  /** Styles applied to the loading container element. */
  loadingContainer: string;
  /** Styles applied to the slide transition element. */
  slideTransition: string;
  /** Styles applied to the month container element. */
  monthContainer: string;
  /** Styles applied to the week container element. */
  weekContainer: string;
}

export type DayCalendarClassKey = keyof DayCalendarClasses;

export const getDayCalendarUtilityClass = (slot: string) =>
  generateUtilityClass('MuiDayCalendar', slot);

export const dayPickerClasses: DayCalendarClasses = generateUtilityClasses('MuiDayCalendar', [
  'header',
  'weekDayLabel',
  'loadingContainer',
  'slideTransition',
  'monthContainer',
  'weekContainer',
]);
