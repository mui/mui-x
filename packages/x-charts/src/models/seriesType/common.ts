import type { StackOffset, StackOrder } from '../../internals/stackSeries';

export type CommonSeriesType = {
  id?: string;
};

export type DefaultizedCommonSeriesType<TValue> = {
  id: string;
  color: string;
  /**
   * Formatter used to render values in tooltip or other data display.
   * @param {TValue} value The series' value to render.
   * @returns {string} The string to dispaly.
   */
  valueFormatter: (value: TValue) => string;
};

export type CartesianSeriesType = {
  xAxisKey?: string;
  yAxisKey?: string;
};

export type StackableSeriesType = {
  stack?: string;
  stackOffset?: StackOffsetType;
  stackOrder?: StackOrderType;
};

export type StackOrderType = keyof typeof StackOrder;
export type StackOffsetType = keyof typeof StackOffset;

export type DefaultizedCartesianSeriesType = Required<CartesianSeriesType>;
