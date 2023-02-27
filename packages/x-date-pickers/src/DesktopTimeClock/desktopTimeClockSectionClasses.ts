import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface DesktopTimeClockSectionClasses {
  /** Styles applied to the root (list) element. */
  root: string;
  /** Styles applied to the list item (by default: MenuItem) element. */
  item: string;
}

export type DesktopTimeClockSectionClassKey = keyof DesktopTimeClockSectionClasses;

export function getDesktopTimeClockSectionUtilityClass(slot: string) {
  return generateUtilityClass('MuiDesktopTimeClockSection', slot);
}

export const desktopTimeClockSectionClasses: DesktopTimeClockSectionClasses =
  generateUtilityClasses('MuiDesktopTimeClockSection', ['root', 'item']);
