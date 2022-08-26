import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface StaticDateTimePickerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type StaticDateTimePickerClassKey = keyof StaticDateTimePickerClasses;

export const getStaticDateTimePickerUtilityClass = (slot: string) =>
  generateUtilityClass('MuiStaticDateTimePicker', slot);

export const staticDateTimePickerClasses: StaticDateTimePickerClasses = generateUtilityClasses(
  'MuiStaticDateTimePicker',
  ['root'],
);
