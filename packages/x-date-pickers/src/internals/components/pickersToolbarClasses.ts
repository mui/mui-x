import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content element. */
  content: string;
}

export type PickersToolbarClassKey = keyof PickersToolbarClasses;

export function getPickersToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersToolbar', slot);
}

export const pickersToolbarClasses = generateUtilityClasses('MuiPickersToolbar', [
  'root',
  'content',
]);
