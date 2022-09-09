import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface DateRangePickerViewDesktopClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the container element. */
  container: string;
}

export type DateRangePickerViewDesktopClassKey = keyof DateRangePickerViewDesktopClasses;

export function getDateRangePickerViewDesktopUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateRangePickerViewDesktop', slot);
}

export const dateRangePickerViewDesktopClasses: DateRangePickerViewDesktopClasses =
  generateUtilityClasses('MuiDateRangePickerViewDesktop', ['root', 'container']);
