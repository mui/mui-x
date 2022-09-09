import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface YearPickerClasses {
  /** Styles applied to the root element. */
  root?: string;
}

export type YearPickerClassKey = keyof YearPickerClasses;

export function getYearPickerUtilityClass(slot: string) {
  return generateUtilityClass('MuiYearPicker', slot);
}

export const yearPickerClasses = generateUtilityClasses('MuiYearPicker', ['root']);
