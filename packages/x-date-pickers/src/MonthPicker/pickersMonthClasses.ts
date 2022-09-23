import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface PickersMonthClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element in mobile mode. */
  modeMobile: string;
  /** Styles applied to the root element in desktop mode. */
  modeDesktop: string;
  /** Styles applied to the month button element. */
  monthButton: string;
  /** Styles applied to a disabled month button element. */
  disabled: string;
  /** Styles applied to a selected month button element. */
  selected: string;
}

export type PickersMonthClassKey = keyof PickersMonthClasses;

export function getPickersMonthUtilityClass(slot: string) {
  // TODO v6 Rename 'PrivatePickersMonth' to 'MuiPickersMonth' to follow convention
  return generateUtilityClass('PrivatePickersMonth', slot);
}

export const pickersMonthClasses = generateUtilityClasses<PickersMonthClassKey>(
  // TODO v6 Rename 'PrivatePickersMonth' to 'MuiPickersMonth' to follow convention
  'PrivatePickersMonth',
  ['root', 'modeMobile', 'modeDesktop', 'monthButton', 'disabled', 'selected'],
);
