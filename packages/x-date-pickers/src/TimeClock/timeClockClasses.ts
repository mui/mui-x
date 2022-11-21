import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface TimeClockClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the arrowSwitcher element. */
  arrowSwitcher: string;
}

export type TimeClockClassKey = keyof TimeClockClasses;

export function getTimeClockUtilityClass(slot: string) {
  return generateUtilityClass('MuiTimeClock', slot);
}

export const timeClockClasses: TimeClockClasses = generateUtilityClasses('MuiTimeClock', [
  'root',
  'arrowSwitcher',
]);
