import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface TimePickerToolbarClasses {
  separator: string;
  hourMinuteLabel: string;
  hourMinuteLabelLandscape: string;
  hourMinuteLabelReverse: string;
  ampmSelection: string;
  ampmLandscape: string;
  ampmLabel: string;
}

export type TimePickerToolbarClassKey = keyof TimePickerToolbarClasses;

export function getTimePickerToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiTimePickerToolbar', slot);
}

export const timePickerToolbarClasses: TimePickerToolbarClasses = generateUtilityClasses(
  'MuiTimePickerToolbar',
  [
    'root',
    'separator',
    'hourMinuteLabel',
    'hourMinuteLabelLandscape',
    'hourMinuteLabelReverse',
    'ampmSelection',
    'ampmLandscape',
    'ampmLabel',
  ],
);
