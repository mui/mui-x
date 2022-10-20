import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersYearClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element in desktop mode. */
  modeDesktop: string;
  /** Styles applied to the root element in mobile mode. */
  modeMobile: string;
  /** Styles applied to the year button element. */
  yearButton: string;
  /** Styles applied to a selected year button element. */
  selected: string;
  /** Styles applied to a disabled year button element. */
  disabled: string;
}

export type PickersYearClassKey = keyof PickersYearClasses;

export function getPickersYearUtilityClass(slot: string) {
  // TODO v6: Rename 'PrivatePickersYear' to 'MuiPickersYear' to follow convention
  return generateUtilityClass('PrivatePickersYear', slot);
}

// TODO v6: Rename 'PrivatePickersYear' to 'MuiPickersYear' to follow convention
export const pickersYearClasses = generateUtilityClasses('PrivatePickersYear', [
  'root',
  'modeDesktop',
  'modeMobile',
  'yearButton',
  'selected',
  'disabled',
]);
