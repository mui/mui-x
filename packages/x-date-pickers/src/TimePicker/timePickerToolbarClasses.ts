import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface TimePickerToolbarClasses {
  separator: string;
  hourMinuteLabel: string;
  hourMinuteLabelLandscape: string;
  hourMinuteLabelReverse: string;
  ampmSelection: string;
  ampmLandscape: string;
  ampmLabel: string;
  penIconLandscape: string;
}

export type TimePickerToolbarClassKey = keyof TimePickerToolbarClasses;

export function getTimePickerToolbarUtilityClass(slot: string) {
  return generateUtilityClass('PrivateTimePickerToolbar', slot);
}

export const timePickerToolbarClasses: TimePickerToolbarClasses = generateUtilityClasses(
  'PrivateTimePickerToolbar',
  [
    'separator',
    'hourMinuteLabel',
    'hourMinuteLabelLandscape',
    'hourMinuteLabelReverse',
    'ampmSelection',
    'ampmLandscape',
    'ampmLabel',
    'penIconLandscape',
  ],
);
