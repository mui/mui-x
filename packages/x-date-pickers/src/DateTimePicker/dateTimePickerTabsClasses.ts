import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DateTimePickerTabsClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type DateTimePickerTabsClassKey = keyof DateTimePickerTabsClasses;

export function getDateTimePickerTabsUtilityClass(slot: string) {
  return generateUtilityClass('MuiDateTimePickerTabs', slot);
}

export const dateTimePickerTabsClasses: DateTimePickerTabsClasses = generateUtilityClasses(
  'MuiDateTimePickerTabs',
  ['root'],
);
