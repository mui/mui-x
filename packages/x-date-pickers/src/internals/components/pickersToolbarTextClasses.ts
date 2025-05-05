import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersToolbarTextClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type PickersToolbarTextClassKey = keyof PickersToolbarTextClasses;

export function getPickersToolbarTextUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersToolbarText', slot);
}

export const pickersToolbarTextClasses = generateUtilityClasses('MuiPickersToolbarText', ['root']);
