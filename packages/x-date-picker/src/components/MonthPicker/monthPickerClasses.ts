import { generateUtilityClass, generateUtilityClasses } from '@mui/base';

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
