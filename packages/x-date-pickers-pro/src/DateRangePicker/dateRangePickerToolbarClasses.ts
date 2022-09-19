import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface DateRangePickerToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the container element. */
  container: string;
}

export type DateRangePickerToolbarClassKey = keyof DateRangePickerToolbarClasses;

export function getDateRangePickerToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateRangePickerToolbar', slot);
}

export const dateRangePickerToolbarClasses: DateRangePickerToolbarClasses = generateUtilityClasses(
  'MuiDateRangePickerToolbar',
  ['root', 'container'],
);
