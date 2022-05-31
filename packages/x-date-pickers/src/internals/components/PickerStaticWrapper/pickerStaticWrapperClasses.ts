import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface PickerStaticWrapperClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content element. */
  content: string;
}

export type PickerStaticWrapperClassKey = keyof PickerStaticWrapperClasses;

export function getStaticWrapperUtilityClass(slot: string): string {
  return generateUtilityClass('MuiPickerStaticWrapper', slot);
}

export const pickerStaticWrapperClasses: PickerStaticWrapperClasses = generateUtilityClasses(
  'MuiPickerStaticWrapper',
  ['root', 'content'],
);
