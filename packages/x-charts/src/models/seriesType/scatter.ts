import { DefaultizedProps } from '@mui/x-internals/types';
import { CartesianSeriesType, CommonDefaultizedProps, CommonSeriesType, SeriesId } from './common';

export type ScatterValueType = {
  x: number;
  y: number;
  z?: any;
  /**
   * A unique identifier for the scatter point
   */
  id: string | number;
};

export interface ScatterSeriesType extends CommonSeriesType<ScatterValueType>, CartesianSeriesType {
  type: 'scatter';
  data?: ScatterValueType[];
  markerSize?: number;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * If true, the interaction will not use element hover for this series.
   * @default false
   */
  disableHover?: boolean;
  /**
   * The id of the z-axis used to render the series.
   */
  zAxisId?: string;

  /**
   * The keys used to retrieve data from the dataset.
   *
   * When this prop is provided, all of `x`, `y`, and `id` must be provided.
   * While `z` is optional.
   */
  datasetKeys?: {
    /**
     * The key used to retrieve data from the dataset for the X axis.
     */
    x: string;
    /**
     * The key used to retrieve data from the dataset for the Y axis.
     */
    y: string;
    /**
     * The key used to retrieve data from the dataset for the Z axis.
     */
    z?: string;
    /**
     * The key used to retrieve data from the dataset for the id.
     */
    id: string;
  };
}

/**
 * An object that allows to identify a single scatter item.
 * Used for item interaction
 */
export type ScatterItemIdentifier = {
  type: 'scatter';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedScatterSeriesType
  extends DefaultizedProps<ScatterSeriesType, CommonDefaultizedProps | 'color'> {}
