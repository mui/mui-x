import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface YearPickerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type YearPickerClassKey = keyof YearPickerClasses;

export function getYearPickerUtilityClass(slot: string) {
  return generateUtilityClass('MuiYearPicker', slot);
}

export const yearPickerClasses = generateUtilityClasses('MuiYearPicker', ['root']);
