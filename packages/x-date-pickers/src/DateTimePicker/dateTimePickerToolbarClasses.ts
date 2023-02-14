import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface DateTimePickerToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the date container element. */
  dateContainer: string;
  /** Styles applied to the time container element. */
  timeContainer: string;
  /** Styles applied to the time (except am/pm) container element. */
  timeDigitsContainer: string;
  /** Styles applied to the time container if rtl. */
  timeLabelReverse: string;
  /** Styles applied to the separator element. */
  separator: string;
  /** Styles applied to the am/pm section. */
  ampmSelection: string;
  /** Styles applied to am/pm section in landscape mode. */
  ampmLandscape: string;
  /** Styles applied to am/pm labels. */
  ampmLabel: string;
}

export type DateTimePickerToolbarClassKey = keyof DateTimePickerToolbarClasses;

export function getDateTimePickerToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateTimePickerToolbar', slot);
}

export const dateTimePickerToolbarClasses: DateTimePickerToolbarClasses = generateUtilityClasses(
  'MuiDateTimePickerToolbar',
  [
    'root',
    'dateContainer',
    'timeContainer',
    'timeDigitsContainer',
    'separator',
    'timeLabelReverse',
    'ampmSelection',
    'ampmLandscape',
    'ampmLabel',
  ],
);
