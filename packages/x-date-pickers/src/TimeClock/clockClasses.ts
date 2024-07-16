import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface ClockClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the clock element. */
  clock: string;
  /** Styles applied to the wrapper element. */
  wrapper: string;
  /** Styles applied to the square mask element. */
  squareMask: string;
  /** Styles applied to the pin element. */
  pin: string;
  /** Styles applied to the am button element. */
  amButton: string;
  /** Styles applied to the pm button element. */
  pmButton: string;
  /** Styles applied to the meridiem typography element. */
  meridiemText: string;
  /** Styles applied to the selected meridiem button element */
  selected: string;
}

export type ClockClassKey = keyof ClockClasses;

export function getClockUtilityClass(slot: string) {
  return generateUtilityClass('MuiClock', slot);
}

export const clockClasses: ClockClasses = generateUtilityClasses('MuiClock', [
  'root',
  'clock',
  'wrapper',
  'squareMask',
  'pin',
  'amButton',
  'pmButton',
  'meridiemText',
  'selected',
]);
