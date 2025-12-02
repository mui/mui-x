import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface HeatmapClasses {
  /** Styles applied to the heatmap cells. */
  cell: string;
  /** Styles applied to the cell element if highlighted. */
  highlighted: string;
  /** Styles applied to the cell element if faded. */
  faded: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${heatmapClasses.series}-${seriesId}`.
   */
  series: string;
}

export type HeatmapClassKey = keyof HeatmapClasses;

export function getHeatmapUtilityClass(slot: string) {
  // Those should be common to all charts
  if (['highlighted', 'faded'].includes(slot)) {
    return generateUtilityClass('Charts', slot);
  }
  return generateUtilityClass('MuiHeatmap', slot);
}
export const heatmapClasses: HeatmapClasses = {
  ...generateUtilityClasses('MuiHeatmap', ['cell', 'series']),
  highlighted: 'Charts-highlighted',
  faded: 'Charts-faded',
};
