import { type DefaultizedProps, type MakeRequired } from '@mui/x-internals/types';
import {
  type CartesianSeriesType,
  type CommonDefaultizedProps,
  type CommonSeriesType,
  type SeriesId,
} from './common';
import { type DatasetElementType } from './config';

export type ScatterValueType = {
  x: number;
  y: number;
  z?: any;
  /**
   * A unique identifier for the scatter point
   */
  id?: string | number;
};

/**
 * Columnar representation of scatter point data, backed by typed arrays.
 *
 * Useful for very large datasets: avoids allocating one JS object per point,
 * enables zero-copy transfer to workers when the underlying buffers are
 * `SharedArrayBuffer`s, and lets the chart's hot paths iterate without
 * dereferencing objects.
 *
 * Detected at runtime via the `__columnar` discriminator.
 */
export type ColumnarScatterData = {
  readonly __columnar: true;
  readonly x: Float64Array;
  readonly y: Float64Array;
  /** Optional Z values (numeric only in columnar form). */
  readonly z?: Float64Array;
  /** Optional per-point ids (numeric only in columnar form). */
  readonly ids?: Int32Array | Float64Array;
  readonly length: number;
};

export type ScatterData = readonly ScatterValueType[] | ColumnarScatterData;

export interface ScatterSeriesType
  extends CommonSeriesType<ScatterValueType | null, 'scatter'>, CartesianSeriesType {
  type: 'scatter';
  data?: ScatterData;
  /**
   * Size of the markers in the scatter plot, in pixels.
   */
  markerSize?: number;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * The id of the z-axis used to render the series.
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
