import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersCalendarHeaderClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the label container element. */
  labelContainer: string;
  /** Styles applied to the label element. */
  label: string;
  /** Styles applied to the switch view button element. */
  switchViewButton: string;
  /** Styles applied to the switch view icon element. */
  switchViewIcon: string;
}

export type PickersCalendarHeaderClassKey = keyof PickersCalendarHeaderClasses;

export const getPickersCalendarHeaderUtilityClass = (slot: string) =>
  generateUtilityClass('MuiPickersCalendarHeader', slot);

export const pickersCalendarHeaderClasses: PickersCalendarHeaderClasses = generateUtilityClasses(
  'MuiPickersCalendarHeader',
  ['root', 'labelContainer', 'label', 'switchViewButton', 'switchViewIcon'],
);
