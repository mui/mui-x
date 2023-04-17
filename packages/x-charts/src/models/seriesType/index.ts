import { BarSeriesType, DefaultizedBarSeriesType } from './bar';
import { DefaultizedLineSeriesType, LineSeriesType } from './line';
import { PieSeriesType } from './pie';
import { DefaultizedScatterSeriesType, ScatterSeriesType } from './scatter';

type AllSeriesType = BarSeriesType | LineSeriesType | PieSeriesType | ScatterSeriesType;

type CartesianSeriesType = BarSeriesType | LineSeriesType | PieSeriesType | ScatterSeriesType;
type DefaultizedCartesianSeriesType =
  | DefaultizedBarSeriesType
  | DefaultizedLineSeriesType
  | PieSeriesType
  | DefaultizedScatterSeriesType;
type StackableSeriesType = BarSeriesType | LineSeriesType;

export type {
  BarSeriesType,
  LineSeriesType,
  PieSeriesType,
  ScatterSeriesType,
  AllSeriesType,
  CartesianSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
};
