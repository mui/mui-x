import {
  type CommonSeriesType,
  type CartesianSeriesType,
  type SeriesId,
  type CommonDefaultizedProps,
} from '@mui/x-charts/internals';
import { type DefaultizedProps } from '@mui/x-internals/types';

/**
 * Type representing the values of a single OHLC element.
 * The array contains four numbers in the following order:
 * [open, high, low, close].
 */
export type OHLCValueType = [number, number, number, number];

export interface OHLCSeriesType
  extends CommonSeriesType<OHLCValueType | null, 'ohlc'>, CartesianSeriesType {
  type: 'ohlc';
  /**
   * The OHLC data points.
   */
  data?: ReadonlyArray<OHLCValueType | null>;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * The keys used to retrieve data from the dataset.
   * When provided, all of `open`, `high`, `low`, and `close` must be specified.
   */
  datasetKeys?: {
    open: string;
    high: string;
    low: string;
    close: string;
  };
}

/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type OHLCItemIdentifier = {
  type: 'ohlc';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedOHLCSeriesType extends DefaultizedProps<
  OHLCSeriesType,
  CommonDefaultizedProps | 'color'
> {}
