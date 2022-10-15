import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface PickersFadeTransitionGroupClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type PickersFadeTransitionGroupClassKey = keyof PickersFadeTransitionGroupClasses;

export const getPickersFadeTransitionGroupUtilityClass = (slot: string) =>
  generateUtilityClass('MuiPickersFadeTransitionGroup', slot);

export const pickersFadeTransitionGroupClasses: PickersFadeTransitionGroupClasses =
  generateUtilityClasses('MuiPickersFadeTransitionGroup', ['root']);
