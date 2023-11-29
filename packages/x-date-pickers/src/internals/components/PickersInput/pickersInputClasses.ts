import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersInputClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if focused. */
  focused: string;
  /** State class applied to the root element if `disabled=true`. */
  disabled: string;
  /** State class applied to the root element if `error=true`. */
  error: string;
  /** Styles applied to the NotchedOutline element. */
  notchedOutline?: string;
  /** Styles applied to the fake input element. */
  input: string;
  /** Styles applied to the section of the picker. */
  content: string;
  /** Styles applied to the startSeparator */
  before: string;
  /** Styles applied to the endSeparator */
  after: string;
  /** Styles applied to the root if there is a startAdornment present */
  adornedStart: string;
  /** Styles applied to the root if there is an endAdornment present */
  adornedEnd: string;
  /** Styles applied to the root element unless `disableUnderline={true}`. */
  underline?: string;
}

export type PickersInputClassKey = keyof PickersInputClasses;

export function getPickersInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersInput', slot);
}
export function getPickersOutlinedInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersOutlinedInput', slot);
}
export function getPickersFilledInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersFilledInput', slot);
}
export function getPickersStandardInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersStandardInput', slot);
}

export const pickersInputClasses = generateUtilityClasses<PickersInputClassKey>('MuiPickersInput', [
  'root',
  'focused',
  'disabled',
  'error',
  'notchedOutline',
  'content',
  'before',
  'after',
  'adornedStart',
  'adornedEnd',
  'input',
]);
export const pickersOutlinedInputClasses = {
  ...pickersInputClasses,
  ...generateUtilityClasses<PickersInputClassKey>('MuiPickersOutlinedInput', [
    'root',
    'notchedOutline',
    'input',
  ]),
};

export const pickersFilledInputClasses = {
  ...pickersInputClasses,
  ...generateUtilityClasses<PickersInputClassKey>('MuiPickersFilledInput', [
    'root',
    'underline',
    'input',
  ]),
};
