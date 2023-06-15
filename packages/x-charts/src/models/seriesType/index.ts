import { BarItemIdentifier, BarSeriesType, DefaultizedBarSeriesType } from './bar';
import { DefaultizedLineSeriesType, LineItemIdentifier, LineSeriesType } from './line';
// import { PieSeriesType } from './pie';
import { DefaultizedScatterSeriesType, ScatterItemIdentifier, ScatterSeriesType } from './scatter';

type AllSeriesType = BarSeriesType | LineSeriesType | ScatterSeriesType;
// | PieSeriesType;

type CartesianSeriesType = BarSeriesType | LineSeriesType | ScatterSeriesType;
// | PieSeriesType;
type DefaultizedCartesianSeriesType =
  | DefaultizedBarSeriesType
  | DefaultizedLineSeriesType
  | DefaultizedScatterSeriesType;
// | PieSeriesType
type StackableSeriesType = DefaultizedBarSeriesType | DefaultizedLineSeriesType;

export type SeriesItemIdentifier = BarItemIdentifier | LineItemIdentifier | ScatterItemIdentifier;

export * from './line';
export * from './bar';
export * from './scatter';
export type { StackOrderType, StackOffsetType } from './common';
export type {
  // PieSeriesType,
  AllSeriesType,
  CartesianSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
};
