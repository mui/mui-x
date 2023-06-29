import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface DateTimeRangePickerToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the container element. */
  container: string;
}

export type DateTimeRangePickerToolbarClassKey = keyof DateTimeRangePickerToolbarClasses;

export function getDateTimeRangePickerToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateTimeRangePickerToolbar', slot);
}

export const dateTimeRangePickerToolbarClasses: DateTimeRangePickerToolbarClasses =
  generateUtilityClasses('MuiDateTimeRangePickerToolbar', ['root', 'container']);
