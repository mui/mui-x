import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface DayCalendarSkeletonClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the week element. */
  week: string;
  /** Styles applied to the day element. */
  daySkeleton: string;
}

export type DayCalendarSkeletonClassKey = keyof DayCalendarSkeletonClasses;

export const getDayCalendarSkeletonUtilityClass = (slot: string) =>
  generateUtilityClass('MuiDayCalendarSkeleton', slot);

export const dayCalendarSkeletonClasses: DayCalendarSkeletonClasses = generateUtilityClasses(
  'MuiDayCalendarSkeleton',
  ['root', 'week', 'daySkeleton'],
);
