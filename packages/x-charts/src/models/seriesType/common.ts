import type { HighlightScope } from '../../context/HighlightProvider';
import type { StackOffsetType, StackOrderType } from '../stacking';

export type CommonSeriesType<TValue> = {
  id?: string;
  color?: string;
  /**
   * Formatter used to render values in tooltip or other data display.
   * @param {TValue} value The series' value to render.
   * @returns {string} The string to dispaly.
   */
  valueFormatter?: (value: TValue) => string;
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
