import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface PickersToolbarClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the title element. */
  title: string;
  /** Styles applied to the content element. */
  content: string;
}

export type PickersToolbarClassKey = keyof PickersToolbarClasses;

export function getPickersToolbarUtilityClass(slot: string) {
  return generateUtilityClass('MuiPickersToolbar', slot);
}

export const pickersToolbarClasses = generateUtilityClasses('MuiPickersToolbar', [
  'root',
  'title',
  'content',
]);
