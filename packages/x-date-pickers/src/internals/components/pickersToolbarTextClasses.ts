import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface PickersToolbarTextClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to a selected root element. */
  selected: string;
}

export type PickersToolbarTextClassKey = keyof PickersToolbarTextClasses;

export function getPickersToolbarTextUtilityClass(slot: string) {
  // TODO v6: Rename 'PrivatePickersToolbarText' to 'MuiPickersToolbarText' to follow convention
  return generateUtilityClass('PrivatePickersToolbarText', slot);
}

// TODO v6: Rename 'PrivatePickersToolbarText' to 'MuiPickersToolbarText' to follow convention
export const pickersToolbarTextClasses = generateUtilityClasses('PrivatePickersToolbarText', [
  'root',
  'selected',
]);
