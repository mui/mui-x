import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PickersLayoutClasses {
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
  /** Styles applied to the shortcuts container. */
  shortcuts: string;
}

export type PickersLayoutClassKey = keyof PickersLayoutClasses;

export function getPickersLayoutUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersLayout', slot);
}

export const pickersLayoutClasses = generateUtilityClasses<PickersLayoutClassKey>(
  'MuiPickersLayout',
  ['root', 'landscape', 'contentWrapper', 'toolbar', 'actionBar', 'tabs', 'shortcuts'],
);
