import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface DateTimeRangePickerTabsClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the tab element. */
  tab: string;
}

export type DateTimeRangePickerTabsClassKey = keyof DateTimeRangePickerTabsClasses;

export function getDateTimeRangePickerTabsUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateTimeRangePickerTabs', slot);
}

export const dateTimeRangePickerTabsClasses: DateTimeRangePickerTabsClasses =
  generateUtilityClasses('MuiDateTimeRangePickerTabs', ['root', 'tab']);
