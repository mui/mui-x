import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface TimeRangePickerTabsClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the tab element. */
  tab: string;
}

export type TimeRangePickerTabsClassKey = keyof TimeRangePickerTabsClasses;

export function getTimeRangePickerTabsUtilityClass(slot: string) {
  return generateUtilityClass('MuiTimeRangePickerTabs', slot);
}

export const timeRangePickerTabsClasses: TimeRangePickerTabsClasses = generateUtilityClasses(
  'MuiTimeRangePickerTabs',
  ['root', 'tab'],
);
