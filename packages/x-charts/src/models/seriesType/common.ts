import type { HighlightScope } from '../../context/HighlightProvider';
import type { StackOffsetType, StackOrderType } from '../stacking';

export type SeriesId = number | string;

export type SeriesValueFormatterContext = {
  /**
   * The index of the value in the data array.
   */
  dataIndex: number;
};

export type SeriesLabelFormatterContext = {
  /**
   * The location where the value is being rendered.
   * - `'tooltip'`: The value is displayed in the tooltip when hovering the chart.
   * - `'legend'`: The value is displayed on the legend.
   */
  location: 'tooltip' | 'legend';
};

export type SeriesValueFormatter<TValue> = (
  value: TValue,
  context: SeriesValueFormatterContext,
) => string;

export type SeriesLabelFormatter = (label: string, context: SeriesLabelFormatterContext) => string;

export type CommonSeriesType<TValue> = {
  id?: SeriesId;
  color?: string;
  /**
   * Formatter used to render values in tooltip or other data display.
   * @param {TValue} value The series' value to render.
   * @param {SeriesValueFormatterContext} context The rendering context of the value.
   * @returns {string} The string to display.
   */
  valueFormatter?: SeriesValueFormatter<TValue>;
  /**
   * Formatter used to render labels in tooltip or legend.
   * @param {string} label The series' value to render.
   * @param {SeriesLabelFormatterContext} context The rendering context of the value.
   * @returns {string} The string to display.
   */
  labelFormatter?: SeriesLabelFormatter;
  highlightScope?: Partial<HighlightScope>;
};

export type CommonDefaultizedProps = 'id' | 'valueFormatter' | 'data';

export type CartesianSeriesType = {
  /**
   * The id of the x-axis used to render the series.
   */
  xAxisKey?: string;
  /**
   * The id of the y-axis used to render the series.
   */
  yAxisKey?: string;
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
