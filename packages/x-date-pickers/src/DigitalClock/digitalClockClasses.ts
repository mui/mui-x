import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface DigitalClockClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type DigitalClockClassKey = keyof DigitalClockClasses;

export function getDigitalClockUtilityClass(slot: string) {
  return generateUtilityClass('MuiDigitalClock', slot);
}

export const digitalClockClasses: DigitalClockClasses = generateUtilityClasses('MuiDigitalClock', [
  'root',
]);
