import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

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
  return generateUtilityClass('MuiPickersYear', slot);
}

export const pickersYearClasses = generateUtilityClasses('MuiPickersYear', [
  'root',
  'modeDesktop',
  'modeMobile',
  'yearButton',
  'selected',
  'disabled',
]);
