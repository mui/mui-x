import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersViewLayoutClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element in landscape orientation. */
  landscape: string;
  /** Styles applied to the contentWrapper element (which contains the tabs and the view itself). */
  contentWrapper: string;
  /** Styles applied to the toolbar. */
  toolbar: string;
  /** Styles applied to the action bar. */
  actionBar: string;
  /** Styles applied to the tabs. */
  tabs: string;
}

export type PickersViewLayoutClassKey = keyof PickersViewLayoutClasses;

export function getPickersViewLayoutUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersViewLayout', slot);
}

export const pickersViewLayoutClasses = generateUtilityClasses<PickersViewLayoutClassKey>(
  'MuiPickersViewLayout',
  ['root', 'landscape', 'contentWrapper', 'toolbar', 'actionBar'],
);
