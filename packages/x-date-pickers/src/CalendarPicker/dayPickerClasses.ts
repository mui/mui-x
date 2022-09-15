import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface DayPickerClasses {
  /** Styles applied to the header element. */
  header: string;
  /** Styles applied to the week day label element. */
  weekDayLabel: string;
  /** Styles applied to the loading container element. */
  loadingContainer: string;
  /** Styles applied to the slide transition element. */
  slideTransition: string;
  /** Styles applied to the month container element. */
  monthContainer: string;
  /** Styles applied to the week container element. */
  weekContainer: string;
}

export type DayPickerClassKey = keyof DayPickerClasses;

export const getDayPickerUtilityClass = (slot: string) =>
  generateUtilityClass('MuiDayPicker', slot);

export const dayPickerClasses: DayPickerClasses = generateUtilityClasses('MuiDayPicker', [
  'header',
  'weekDayLabel',
  'loadingContainer',
  'slideTransition',
  'monthContainer',
  'weekContainer',
]);
