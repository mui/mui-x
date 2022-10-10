import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export function getMonthPickerUtilityClass(slot: string) {
  return generateUtilityClass('MuiMonthPicker', slot);
}

export interface MonthPickerClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type MonthPickerClassKey = keyof MonthPickerClasses;

export const monthPickerClasses = generateUtilityClasses<MonthPickerClassKey>('MuiMonthPicker', [
  'root',
]);
