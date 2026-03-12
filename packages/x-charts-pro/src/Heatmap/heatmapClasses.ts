import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import type { HeatmapCellOwnerState } from './heatmapChartClasses';

export { type HeatmapCellOwnerState };

/**
 * @deprecated Use `HeatmapChartClasses` from `./heatmapChartClasses` instead.
 */
export interface HeatmapClasses {
  /** Styles applied to the heatmap cells. */
  cell: string;
  /**
   * Styles applied to the cell element if highlighted.
   * @deprecated Use `[data-highlighted]` selector instead.
   */
  highlighted: string;
  /**
   * Styles applied to the cell element if faded.
   * @deprecated Use `[data-faded]` selector instead.
   */
  faded: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${heatmapClasses.series}-${seriesId}`.
   * @deprecated Use `[data-series="${seriesId}"]` selector instead.
   */
  series: string;
}

/**
 * @deprecated Use `HeatmapChartClassKey` from `./heatmapChartClasses` instead.
 */
export type HeatmapClassKey = keyof HeatmapClasses;

/**
 * @deprecated Use `getHeatmapChartUtilityClass` from `./heatmapChartClasses` instead.
 */
export function getHeatmapUtilityClass(slot: string) {
  // Those should be common to all charts
  if (['highlighted', 'faded'].includes(slot)) {
    return generateUtilityClass('Charts', slot);
  }
  return generateUtilityClass('MuiHeatmap', slot);
}

/**
 * @deprecated Use `heatmapChartClasses` from `./heatmapChartClasses` instead.
 */
export const heatmapClasses: HeatmapClasses = {
  ...generateUtilityClasses('MuiHeatmap', ['cell', 'series']),
  highlighted: 'Charts-highlighted',
  faded: 'Charts-faded',
};

/**
 * @deprecated Use `useUtilityClasses` from `./heatmapChartClasses` instead.
 * @internal
 */
export const useDeprecatedUtilityClasses = (ownerState: HeatmapCellOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted } = ownerState;
  const slots = {
    cell: ['cell', `series-${seriesId}`, isFaded && 'faded', isHighlighted && 'highlighted'],
  };
  return composeClasses(slots, getHeatmapUtilityClass, classes);
};
