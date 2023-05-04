import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersMonthClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the month button element. */
  monthButton: string;
  /** Styles applied to a disabled month button element. */
  disabled: string;
  /** Styles applied to a selected month button element. */
  selected: string;
}

export type PickersMonthClassKey = keyof PickersMonthClasses;

export function getPickersMonthUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersMonth', slot);
}

export const pickersMonthClasses = generateUtilityClasses<PickersMonthClassKey>('MuiPickersMonth', [
  'root',
  'monthButton',
  'disabled',
  'selected',
]);
