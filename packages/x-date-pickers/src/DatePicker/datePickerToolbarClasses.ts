import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DatePickerToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the title element. */
  title: string;
}

export type DatePickerToolbarClassKey = keyof DatePickerToolbarClasses;

export function getDatePickerToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiDatePickerToolbar', slot);
}

export const datePickerToolbarClasses: DatePickerToolbarClasses = generateUtilityClasses(
  'MuiDatePickerToolbar',
  ['root', 'title'],
);
