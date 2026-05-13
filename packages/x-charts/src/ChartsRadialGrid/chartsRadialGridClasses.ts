import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsRadialGridClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to every line element. */
  line: string;
  /** Styles applied to rotation (spoke) lines. */
  rotationLine: string;
  /** Styles applied to radius (circular) lines. */
  radiusLine: string;
}

export type ChartsRadialGridClassKey = keyof ChartsRadialGridClasses;

export function getChartsRadialGridUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsRadialGrid', slot);
}
export const chartsRadialGridClasses: ChartsRadialGridClasses = generateUtilityClasses(
  'MuiChartsRadialGrid',
  ['root', 'line', 'rotationLine', 'radiusLine'],
);
