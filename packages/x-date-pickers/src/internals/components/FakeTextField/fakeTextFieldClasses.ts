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
}

export type FakeTextFieldClassKey = keyof FakeTextFieldClasses;

export function getFakeTextFieldUtilityClass(slot: string) {
  return generateUtilityClass('MuiFakeTextField', slot);
}

export const fakeTextFieldClasses = generateUtilityClasses<FakeTextFieldClassKey>(
  'MuiFakeTextField',
  ['root', 'focused', 'disabled'],
);
