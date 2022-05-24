import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface ClockPickerClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the arrowSwitcher element. */
  arrowSwitcher: string;
}

export type ClockPickerClassKey = keyof ClockPickerClasses;

export function getClockPickerUtilityClass(slot: string) {
  return generateUtilityClass('MuiClockPicker', slot);
}

export const clockPickerClasses: ClockPickerClasses = generateUtilityClasses('MuiClockPicker', [
  'root',
  'arrowSwitcher',
]);
