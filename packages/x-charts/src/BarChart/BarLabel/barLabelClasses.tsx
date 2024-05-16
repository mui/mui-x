import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface BarLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the root element if it is faded. */
  faded: string;
}

export type BarLabelClassKey = keyof BarLabelClasses;

export function getBarLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiBarLabel', slot);
}

export const barLabelClasses = generateUtilityClasses('MuiBarLabel', [
  'root',
  'highlighted',
  'faded',
]);
