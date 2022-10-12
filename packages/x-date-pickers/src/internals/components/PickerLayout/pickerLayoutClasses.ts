import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface PickerLayoutClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type PickerLayoutClassKey = keyof PickerLayoutClasses;

export function getPickerLayoutUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickerLayout', slot);
}

export const pickerLayoutClasses = generateUtilityClasses('MuiPickerLayout', ['root']);
