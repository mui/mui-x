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

/**
 * The OHLC field names.
 */
export type OHLCField = 'open' | 'high' | 'low' | 'close';

export interface OHLCSeriesType
  extends
    Omit<CommonSeriesType<OHLCValueType | null, 'ohlc'>, 'valueFormatter'>,
    CartesianSeriesType {
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
   * Formatter used to render individual OHLC values in a tooltip or other data display.
   * @param {number | null} value The individual value to render.
   * @param {object} context The rendering context.
   * @param {number} context.dataIndex The index of the data point in the series data array.
   * @param {OHLCField} context.field The OHLC field name ('open', 'high', 'low', or 'close').
   * @returns {string} The formatted string.
   */
  valueFormatter?: (
    value: number | null,
    context: { dataIndex: number; field: OHLCField },
  ) => string;
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
