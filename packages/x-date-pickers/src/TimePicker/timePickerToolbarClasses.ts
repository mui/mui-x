import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface TimePickerToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the separator element. */
  separator: string;
  /** Styles applied to the time sections element. */
  hourMinuteLabel: string;
  /** Styles applied to the time sections element in landscape mode. */
  hourMinuteLabelLandscape: string;
  /** Styles applied to the time sections element in "rtl" theme mode. */
  hourMinuteLabelReverse: string;
  /** Styles applied to the meridiem selection element. */
  ampmSelection: string;
  /** Styles applied to the meridiem selection element in landscape mode. */
  ampmLandscape: string;
  /** Styles applied to the meridiem label element. */
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
