import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface PickersToolbarButtonClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type PickersToolbarButtonClassKey = keyof PickersToolbarButtonClasses;

export function getPickersToolbarButtonUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersToolbarButton', slot);
}

export const pickersToolbarButtonClasses = generateUtilityClasses('MuiPickersToolbarButton', [
  'root',
]);
