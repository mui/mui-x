import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickerViewLayoutClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content element (which contains the toolbar, tabs and the view itself). */
  content: string;
  /** Style applied to the content element in landscape orientation */
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
