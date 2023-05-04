import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersPopperClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the paper element. */
  paper: string;
}

export type PickersPopperClassKey = keyof PickersPopperClasses;

export function getPickersPopperUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersPopper', slot);
}

export const pickersPopperClasses = generateUtilityClasses('MuiPickersPopper', ['root', 'paper']);
