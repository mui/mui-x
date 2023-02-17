import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DigitalClockClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the list (by default: MenuList) element. */
  list: string;
  /** Styles applied to the list item (by default: MenuItem) element. */
  item: string;
}

export type DigitalClockClassKey = keyof DigitalClockClasses;

export function getDigitalClockUtilityClass(slot: string) {
  return generateUtilityClass('MuiDigitalClock', slot);
}

export const digitalClockClasses: DigitalClockClasses = generateUtilityClasses('MuiDigitalClock', [
  'root',
  'list',
  'item',
]);
