import { type DefaultizedProps, type MakeRequired } from '@mui/x-internals/types';
import {
  type CartesianSeriesType,
  type CommonDefaultizedProps,
  type CommonSeriesType,
  type SeriesId,
} from './common';

export type ScatterValueType = {
  x: number;
  y: number;
  z?: any;
  /**
   * A unique identifier for the scatter point
   */
  id?: string | number;
};

export interface ScatterSeriesType
  extends CommonSeriesType<ScatterValueType | null, 'scatter'>, CartesianSeriesType {
  type: 'scatter';
  data?: readonly ScatterValueType[];
  /**
   * Size of the markers in the scatter plot, in pixels.
   */
  markerSize?: number;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * If true, the interaction will not use element hover for this series.
   * @default false
   * @deprecated This prop will be removed in a future version because it is ambiguous. You can select what to disable
   *             on hover by disabling the highlight or the tooltip separately.
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
    id?: string;
  };
  preview?: {
    /**
     * The size of the preview marker in pixels.
     * @default 1
     */
    markerSize?: number;
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

export interface DefaultizedScatterSeriesType extends DefaultizedProps<
  ScatterSeriesType,
  CommonDefaultizedProps | 'color' | 'markerSize'
> {
  preview: MakeRequired<NonNullable<ScatterSeriesType['preview']>, 'markerSize'>;
  hidden: boolean;
}
