import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DateTimeRangePickerTabsClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the tab button element. */
  tabButton: string;
  /** Styles applied to the tab navigation button elements. */
  navigationButton: string;
  /** Styles applied to the filler element, shown instead of a navigation arrow. */
  filler: string;
}

export type DateTimeRangePickerTabsClassKey = keyof DateTimeRangePickerTabsClasses;

export function getDateTimeRangePickerTabsUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateTimeRangePickerTabs', slot);
}

export const dateTimeRangePickerTabsClasses: DateTimeRangePickerTabsClasses =
  generateUtilityClasses('MuiDateTimeRangePickerTabs', [
    'root',
    'tabButton',
    'navigationButton',
    'filler',
  ]);
