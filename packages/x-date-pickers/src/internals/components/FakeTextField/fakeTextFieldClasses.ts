import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface FakeTextFieldClasses {
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
export type FakeTextFieldClassKey = keyof FakeTextFieldClasses;

export function getFakeTextFieldUtilityClass(slot: string) {
  return generateUtilityClass('MuiFakeTextField', slot);
}

export const fakeTextFieldClasses = generateUtilityClasses<FakeTextFieldClassKey>(
  'MuiFakeTextField',
  ['root', 'focused', 'disabled', 'error', 'required'],
);
export interface FakeInputClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if focused. */
  focused: string;
  /** State class applied to the root element if `disabled=true`. */
  disabled: string;
  /** State class applied to the root element if `error=true`. */
  error: string;
  /** Styles applied to the NotchedOutline element. */
  notchedOutline: string;
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
}

export type FakeInputClassKey = keyof FakeInputClasses;

export function getFakeInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiFakeInput', slot);
}

export const fakeInputClasses = generateUtilityClasses<FakeInputClassKey>('MuiFakeInput', [
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
