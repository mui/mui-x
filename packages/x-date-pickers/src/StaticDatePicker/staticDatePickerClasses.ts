import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface StaticDatePickerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type StaticDatePickerClassKey = keyof StaticDatePickerClasses;

export const getStaticDatePickerUtilityClass = (slot: string) =>
  generateUtilityClass('MuiStaticDatePicker', slot);

export const staticDatePickerClasses: StaticDatePickerClasses = generateUtilityClasses(
  'MuiStaticDatePicker',
  ['root'],
);
