import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartsPolarGridClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to every line element. */
  line: string;
  /** Styles applied to radial lines (from center to edge). */
  radialLine: string;
  /** Styles applied to circular grid rings. */
  circularLine: string;
}

export type ChartsPolarGridClassKey = keyof ChartsPolarGridClasses;

export function getChartsPolarGridUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsPolarGrid', slot);
}

export const chartsPolarGridClasses: ChartsPolarGridClasses = generateUtilityClasses(
  'MuiChartsPolarGrid',
  ['root', 'line', 'radialLine', 'circularLine'],
);
