import { type DefaultizedProps, type MakeRequired } from '@mui/x-internals/types';
import {
  type CartesianSeriesType,
  type CommonDefaultizedProps,
  type CommonSeriesType,
  type SeriesId,
} from './common';
import { type DatasetElementType } from './config';
import { type ScatterSampling } from './sampling';

export type ScatterValueType = {
  x: number;
  y: number;
  /**
   * The value used to compute the color of the scatter point through a color axis.
   */
  colorValue?: any;
  /**
   * The value used to compute the size of the scatter point through a size axis.
   */
  sizeValue?: any;
  /**
   * The value used to compute the color of the scatter point through a color axis.
   * @deprecated Use `colorValue` instead.
   */
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
   * The id of the color axis used to compute the color of the scatter points.
   * It points to the id of an axis defined with the `zAxis` prop.
   */
  colorAxisId?: string;
  /**
   * The id of the size axis used to compute the size of the scatter points.
   * It points to the id of an axis defined with the `zAxis` prop.
   */
  sizeAxisId?: string;
  /**
   * The id of the z-axis used to render the series.
   * @deprecated Use `colorAxisId` instead.
   */
  zAxisId?: string;

  /**
   * A function to extract and transform the value from the `dataset` item.
   * It receives the full dataset item and should return a scatter value.
   * Can be used as an alternative to `datasetKeys`.
   * @param {DatasetElementType<unknown>} item The full dataset item.
   * @returns {ScatterValueType} The transformed value.
   */
  valueGetter?: (item: DatasetElementType<unknown>) => ScatterValueType;
  /**
   * The keys used to retrieve data from the dataset.
   *
   * When this prop is provided, both `x` and `y` must be provided.
   * While `color`, `size`, and `id` are optional.
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
     * The key used to retrieve data from the dataset for the color value.
     */
    colorValue?: string;
    /**
     * The key used to retrieve data from the dataset for the size value.
     */
    sizeValue?: string;
    /**
     * The key used to retrieve data from the dataset for the Z axis.
     * @deprecated Use `colorValue` instead.
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
  /**
   * The downsampling method used to reduce the number of rendered points for performance.
   * Sampling only affects rendering: axis extremums, tooltips, highlight, and item interaction
   * keep using the full data.
   *
   * The algorithms are provided by the Pro package (`@mui/x-charts-pro`). Setting this prop on a
   * community chart has no effect.
   */
  sampling?: ScatterSampling;
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
  /**
   * The sorted subset of original data indices to render, computed by the sampling algorithm.
   * When defined, rendering iterates this subset instead of every point. The full `data` array is
   * left untouched so everything else keeps using the complete dataset.
   * @ignore - populated by the sampling plugin of the Pro package.
   */
  sampledIndices?: number[];
}
