import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content element. */
  content: string;
  /** Styles applied to the pen icon button element. */
  penIconButton: string;
  /** Styles applied to the pen icon button element in landscape mode. */
  penIconButtonLandscape: string;
}

export type PickersToolbarClassKey = keyof PickersToolbarClasses;

export function getPickersToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersToolbar', slot);
}

export const pickersToolbarClasses = generateUtilityClasses('MuiPickersToolbar', [
  'root',
  'content',
  'penIconButton',
  'penIconButtonLandscape',
]);
