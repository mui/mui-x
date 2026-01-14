import { type DefaultizedProps } from '@mui/x-internals/types';
import {
  type CommonDefaultizedProps,
  type CommonSeriesType,
  type CartesianSeriesType,
} from '@mui/x-charts/internals';

export type HeatmapValueType = readonly [number, number, number];

export interface HeatmapSeriesType
  extends Omit<CommonSeriesType<HeatmapValueType>, 'color' | 'colorGetter'>, CartesianSeriesType {
  type: 'heatmap';
  /**
   * Data associated to each bar.
   */
  data?: readonly HeatmapValueType[];
  /**
   * The key used to retrieve data from the dataset.
   */
  dataKey?: string;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
}

/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type HeatmapItemIdentifier = {
  type: 'heatmap';
  /**
   * The id of the series the cell belongs to.
   */
  seriesId: DefaultizedHeatmapSeriesType['id'];
  /**
   * The data index of the cell.
   * Is defined only if some data is associated to the cell.
   */
  dataIndex?: number;
  /**
   * The x index of the cell. Useful to identify the cell position in the heatmap even if there is no data.
   */
  xIndex?: number;
  /**
   * The y index of the cell. Useful to identify the cell position in the heatmap even if there is no data.
   */
  yIndex?: number;
};

export interface DefaultizedHeatmapSeriesType extends DefaultizedProps<
  HeatmapSeriesType,
  CommonDefaultizedProps
> {}
