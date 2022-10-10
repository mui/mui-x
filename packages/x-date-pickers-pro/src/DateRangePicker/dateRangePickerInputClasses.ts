import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface DateRangePickerInputClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type DateRangePickerInputClassKey = keyof DateRangePickerInputClasses;

export function getDateRangePickerInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateRangePickerInput', slot);
}

export const dateRangePickerInputClasses: DateRangePickerInputClasses = generateUtilityClasses(
  'MuiDateRangePickerInput',
  ['root'],
);
