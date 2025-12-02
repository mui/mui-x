import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ClockPointerClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the thumb element. */
  thumb: string;
}

export type ClockPointerClassKey = keyof ClockPointerClasses;

export function getClockPointerUtilityClass(slot: string) {
  return generateUtilityClass('MuiClockPointer', slot);
}

export const clockPointerClasses: ClockPointerClasses = generateUtilityClasses('MuiClockPointer', [
  'root',
  'thumb',
]);
