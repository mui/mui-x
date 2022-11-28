import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersViewLayoutClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element in landscape orientation. */
  landscape: string;
  /** Styles applied to the content element (which contains the tabs and the view itself). */
  content: string;
  /** Styles applied to the toolbar wrapper (used to position it) */
  toolbar: string;
  /** Styles applied to the action bar wrapper (used to position it) */
  actionbar: string;
}

export type PickersViewLayoutClassKey = keyof PickersViewLayoutClasses;

export function getPickersViewLayoutUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersViewLayout', slot);
}

export const pickersViewLayoutClasses = generateUtilityClasses<PickersViewLayoutClassKey>(
  'MuiPickersViewLayout',
  ['root', 'landscape', 'content', 'toolbar', 'actionbar'],
);
