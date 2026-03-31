import type { ChartsColor } from '@mui/x-charts/colorPalettes';
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
   * The color of the candle body when the close price is greater than or equal to the open price.
   * @default (mode) =>  mode === 'dark' ? '#66bb6a' : '#2e7d32'
   */
  upColor?: ChartsColor;
  /**
   * The color of the candle body when the close price is less than the open price.
   * @default (mode) =>  mode === 'dark' ? '#f44336' : '#d32f2f'
   */
  downColor?: ChartsColor;
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
  CommonDefaultizedProps | 'color' | 'upColor' | 'downColor'
> {}
