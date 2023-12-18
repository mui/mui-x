import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PickersTextFieldClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if focused. */
  focused: string;
  /** State class applied to the root element if `disabled=true`. */
  disabled: string;
  /** State class applied to the root element if `error=true`. */
  error: string;
  /** State class applied to the root element id `required=true` */
  required: string;
}
export type PickersTextFieldClassKey = keyof PickersTextFieldClasses;

export function getPickersTextFieldUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersTextField', slot);
}

export const pickersTextFieldClasses = generateUtilityClasses<PickersTextFieldClassKey>(
  'MuiPickersTextField',
  ['root', 'focused', 'disabled', 'error', 'required'],
);
export interface PickersInputClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if focused. */
  focused: string;
  /** State class applied to the root element if `disabled=true`. */
  disabled: string;
  /** State class applied to the root element if `readOnly=true`. */
  readOnly: string;
  /** State class applied to the root element if `error=true`. */
  error: string;
  /** Styles applied to the NotchedOutline element. */
  notchedOutline: string;
  /** Styles applied to the real hidden input element. */
  input: string;
  /** Styles applied to the container of the sections. */
  sectionsContainer: string;
  /** Styles applied to the content of a section. */
  sectionContent: string;
  /** Styles applied to the separator before a section */
  sectionBefore: string;
  /** Styles applied to the separator after a section */
  sectionAfter: string;
  /** Styles applied to the root if there is a startAdornment present */
  adornedStart: string;
  /** Styles applied to the root if there is an endAdornment present */
  adornedEnd: string;
}

export type PickersInputClassKey = keyof PickersInputClasses;

export function getPickersInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersInput', slot);
}

export const pickersInputClasses = generateUtilityClasses<PickersInputClassKey>('MuiPickersInput', [
  'root',
  'focused',
  'disabled',
  'error',
  'notchedOutline',
  'adornedStart',
  'adornedEnd',
  'input',
  'sectionsContainer',
  'sectionContent',
  'sectionBefore',
  'sectionAfter',
]);
