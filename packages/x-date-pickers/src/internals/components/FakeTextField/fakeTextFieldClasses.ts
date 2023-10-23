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
}
export type FakeTextFieldClassKey = keyof FakeTextFieldClasses;

export function getFakeTextFieldUtilityClass(slot: string) {
  return generateUtilityClass('MuiFakeTextField', slot);
}

export const fakeTextFieldClasses = generateUtilityClasses<FakeTextFieldClassKey>(
  'MuiFakeTextField',
  ['root', 'focused', 'disabled', 'error'],
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
  /** Styles applied to the section of the icker. */
  section: string;
}

export type FakeInputClassKey = keyof FakeInputClasses;

export function getFakeInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiFakeInput', slot);
}

export const fakeInputClasses = generateUtilityClasses<FakeInputClassKey>('MuiFakeInput', [
  'root',
  'focused',
  'disabled',
  'notchedOutline',
  'section',
  'error',
]);
