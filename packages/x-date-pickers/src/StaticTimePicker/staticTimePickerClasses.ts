import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface StaticTimePickerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type StaticTimePickerClassKey = keyof StaticTimePickerClasses;

export const getStaticTimePickerUtilityClass = (slot: string) =>
  generateUtilityClass('MuiStaticTimePicker', slot);

export const staticTimePickerClasses: StaticTimePickerClasses = generateUtilityClasses(
  'MuiStaticTimePicker',
  ['root'],
);
