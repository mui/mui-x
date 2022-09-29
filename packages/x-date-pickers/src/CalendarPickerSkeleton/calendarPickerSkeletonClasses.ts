import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface CalendarPickerSkeletonClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the week element. */
  week: string;
  /** Styles applied to the day element. */
  daySkeleton: string;
}

export type CalendarPickerSkeletonClassKey = keyof CalendarPickerSkeletonClasses;

export const getCalendarPickerSkeletonUtilityClass = (slot: string) =>
  generateUtilityClass('MuiCalendarPickerSkeleton', slot);

export const calendarPickerSkeletonClasses: CalendarPickerSkeletonClasses = generateUtilityClasses(
  'MuiCalendarPickerSkeleton',
  ['root', 'week', 'daySkeleton'],
);
