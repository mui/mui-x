import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DesktopTimeClockClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type DesktopTimeClockClassKey = keyof DesktopTimeClockClasses;

export function getDesktopTimeClockUtilityClass(slot: string) {
  return generateUtilityClass('MuiDesktopTimeClock', slot);
}

export const desktopTimeClockClasses: DesktopTimeClockClasses = generateUtilityClasses(
  'MuiDesktopTimeClock',
  ['root'],
);
