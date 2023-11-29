import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

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
