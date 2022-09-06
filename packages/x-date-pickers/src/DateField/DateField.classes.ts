import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface DateFieldClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the input element. */
  input: string;
}

export type DateFieldClassKey = keyof DateFieldClasses;

export const getDateFieldUtilityClass = (slot: string) =>
  generateUtilityClass('MuiDateField', slot);

export const dateFieldClasses: DateFieldClasses = generateUtilityClasses('MuiDateField', [
  'root',
  'input',
]);
