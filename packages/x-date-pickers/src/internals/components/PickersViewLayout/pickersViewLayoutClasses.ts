import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface PickersViewLayoutClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the content element (which contains the tabs and the view itself). */
  content: string;
  /** Style applied to the content element in landscape orientation */
  'content--landscape': string;
  /** Styles applied to the toolbar wrapper (used to position it) */
  toolbar: string;
  /** Style applied to the toolbar element in landscape orientation */
  'toolbar--landscape': string;
  /** Styles applied to the action bar wrapper (used to position it) */
  actionbar: string;
  /** Style applied to the action bar element in landscape orientation */
  'actionbar--landscape': string;
}

export type PickersViewLayoutClassKey = keyof PickersViewLayoutClasses;

export function getPickersViewLayoutUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersViewLayout', slot);
}

export const pickersViewLayoutClasses = generateUtilityClasses<PickersViewLayoutClassKey>(
  'MuiPickersViewLayout',
  [
    'root',
    'content',
    'content--landscape',
    'toolbar',
    'toolbar--landscape',
    'actionbar',
    'actionbar--landscape',
  ],
);
