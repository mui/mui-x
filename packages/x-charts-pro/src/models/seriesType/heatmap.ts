import {
  DefaultizedProps,
  CommonDefaultizedProps,
  CommonSeriesType,
  CartesianSeriesType,
} from '@mui/x-charts/internals';

export type HeatmapValueType = [number, number, number];

export interface HeatmapSeriesType
  extends Omit<CommonSeriesType<HeatmapValueType>, 'color'>,
    CartesianSeriesType {
  type: 'heatmap';
  /**
   * Data associated to each bar.
   */
  data?: HeatmapValueType[];
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
  seriesId: DefaultizedHeatmapSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedHeatmapSeriesType
  extends DefaultizedProps<HeatmapSeriesType, CommonDefaultizedProps> {}
