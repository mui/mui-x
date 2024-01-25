import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsGridClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the main line element. */
  line: string;
  /** Styles applied to x-axes. */
  horizontalLine: string;
  /** Styles applied to y-axes. */
  verticalLine: string;
}

export type ChartsGridClassKey = keyof ChartsGridClasses;

export function getGridUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsGrid', slot);
}
export const gridClasses: ChartsGridClasses = generateUtilityClasses('MuiChartsGrid', [
  'root',
  'line',
  'horizontalLine',
  'verticalLine',
]);
