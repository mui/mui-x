import {
  type CommonSeriesType,
  type CartesianSeriesType,
  type SeriesId,
  type CommonDefaultizedProps,
  type SeriesValueFormatter,
} from '@mui/x-charts/internals';
import { type DefaultizedProps } from '@mui/x-internals/types';

/**
 * Type representing the values of a single OHLC element.
 * The array contains four numbers in the following order:
 * [open, high, low, close].
 */
export type OHLCValueType = [number, number, number, number];

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
   * Formatter used to render values in tooltip or other data display.
   * @param {TValue} value The series' value to render.
   * @param {SeriesValueFormatterContext} context The rendering context of the value.
   * @returns {string | null} The string to display or null if the value should not be shown.
   */
  valueFormatter?: SeriesValueFormatter<OHLCValueType[number]>;
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
