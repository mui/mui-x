import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { type SeriesId } from '@mui/x-charts/models';

export interface HeatmapChartClasses {
  /** Styles applied to the heatmap plot root element. */
  root: string;
  /** Styles applied to an individual heatmap cell element. */
  cell: string;
  /** Styles applied to the group surrounding a series' heatmap elements. */
  series: string;
}

export type HeatmapChartClassKey = keyof HeatmapChartClasses;

export interface HeatmapCellOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<HeatmapChartClasses>;
}

export function getHeatmapChartUtilityClass(slot: string) {
  return generateUtilityClass('MuiHeatmapChart', slot);
}

export const heatmapChartClasses: HeatmapChartClasses = generateUtilityClasses('MuiHeatmapChart', [
  'root',
  'cell',
  'series',
]);

export const useUtilityClasses = (options?: { classes?: Partial<HeatmapChartClasses> }) => {
  const { classes } = options ?? {};
  const slots = {
    root: ['root'],
    cell: ['cell'],
    series: ['series'],
  };

  return composeClasses(slots, getHeatmapChartUtilityClass, classes);
};
