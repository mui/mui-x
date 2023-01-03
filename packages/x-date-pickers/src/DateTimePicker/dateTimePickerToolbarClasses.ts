import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface DateTimePickerToolbarClasses {
  dateContainer: string;
  timeContainer: string;
  separator: string;
  ampmSelection: string;
  ampmLandscape: string;
  ampmLabel: string;
}

export type DateTimePickerToolbarClassKey = keyof DateTimePickerToolbarClasses;

export function getDateTimePickerToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateTimePickerToolbar', slot);
}

export const dateTimePickerToolbarClasses = generateUtilityClasses('MuiDateTimePickerToolbar', [
  'root',
  'dateContainer',
  'timeContainer',
  'separator',
  'ampmSelection',
  'ampmLandscape',
  'ampmLabel',
]);
