import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface PickerViewLayoutClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content element (which contains the toolbar, tabs and the view itself). */
  content: string;
  /** Style applied to the content element when the orientation is landscape */
  'content--landscape': string;
}

export type PickerViewLayoutClassKey = keyof PickerViewLayoutClasses;

export function getPickerViewLayoutUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickerViewLayout', slot);
}

export const pickerViewLayoutClasses = generateUtilityClasses<PickerViewLayoutClassKey>(
  'MuiPickerViewLayout',
  ['root', 'content', 'content--landscape'],
);
