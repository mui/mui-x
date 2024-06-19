import {
  unstable_generateUtilityClass as generateUtilityClass,
  unstable_generateUtilityClasses as generateUtilityClasses,
} from '@mui/utils';

export interface HeatmapClasses {
  /** Styles applied to the heatmap cells. */
  cell: string;
  /** Styles applied to the cell element if highlighted. */
  highlighted: string;
  /** Styles applied to the cell element if faded. */
  faded: string;
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
  ...generateUtilityClasses('MuiHeatmap', ['cell']),
  highlighted: 'Charts-highlighted',
  faded: 'Charts-faded',
};
