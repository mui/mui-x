import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface PickersArrowSwitcherClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the spacer element. */
  spacer: string;
  /** Styles applied to the button element. */
  button: string;
}

export type PickersArrowSwitcherClassKey = keyof PickersArrowSwitcherClasses;

export function getPickersArrowSwitcherUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersArrowSwitcher', slot);
}

export const pickersArrowSwitcherClasses = generateUtilityClasses('MuiPickersArrowSwitcher', [
  'root',
  'spacer',
  'button',
]);
