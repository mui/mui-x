import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

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
