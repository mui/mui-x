import { BarSeriesType, DefaultizedBarSeriesType } from './bar';
import { DefaultizedLineSeriesType, LineSeriesType } from './line';
// import { PieSeriesType } from './pie';
import { DefaultizedScatterSeriesType, ScatterSeriesType } from './scatter';

type AllSeriesType = BarSeriesType | LineSeriesType | ScatterSeriesType;
// | PieSeriesType;

type CartesianSeriesType = BarSeriesType | LineSeriesType | ScatterSeriesType;
// | PieSeriesType;
type DefaultizedCartesianSeriesType =
  | DefaultizedBarSeriesType
  | DefaultizedLineSeriesType
  | DefaultizedScatterSeriesType;
// | PieSeriesType
type StackableSeriesType = BarSeriesType | LineSeriesType;

export type {
  BarSeriesType,
  LineSeriesType,
  // PieSeriesType,
  ScatterSeriesType,
  AllSeriesType,
  CartesianSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
};
