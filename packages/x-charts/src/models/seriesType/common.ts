import type { HighlightScope } from '../../context';
import type { StackOffsetType, StackOrderType } from '../stacking';

export type SeriesId = number | string;

export type SeriesValueFormatterContext = {
  /**
   * The index of the value in the data array.
   */
  dataIndex: number;
};

export type SeriesValueFormatter<TValue> = (
  value: TValue,
  context: SeriesValueFormatterContext,
) => string | null;

export type CommonSeriesType<TValue> = {
  id?: SeriesId;
  color?: string;
  /**
   * Formatter used to render values in tooltip or other data display.
   * @param {TValue} value The series' value to render.
   * @param {SeriesValueFormatterContext} context The rendering context of the value.
   * @returns {string | null} The string to display or null if the value should not be shown.
   */
  valueFormatter?: SeriesValueFormatter<TValue>;
  /**
   * The scope to apply when the series is highlighted.
   */
  highlightScope?: Partial<HighlightScope>;
};

export type CommonDefaultizedProps = 'id' | 'valueFormatter' | 'data';

export type CartesianSeriesType = {
  /**
   * The id of the x-axis used to render the series.
   */
  xAxisId?: string;
  /**
   * The id of the y-axis used to render the series.
   */
  yAxisId?: string;
};

export type StackableSeriesType = {
  /**
   * The key that identifies the stacking group.
   * Series with the same `stack` property will be stacked together.
   */
  stack?: string;
  /**
   * Defines how stacked series handle negative values.
   */
  stackOffset?: StackOffsetType;
  /**
   * The order in which series' of the same group are stacked together.
   * @default 'none'
   */
  stackOrder?: StackOrderType;
};

export type DefaultizedCartesianSeriesType = Required<CartesianSeriesType>;
