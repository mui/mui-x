import { BarSeriesType } from './bar';
import { LineSeriesType } from './line';
import { PieSeriesType } from './pie';
import { ScatterSeriesType } from './scatter';

type AllSeriesType = BarSeriesType | LineSeriesType | PieSeriesType | ScatterSeriesType;
type CartesianSeriesType = BarSeriesType | LineSeriesType | PieSeriesType | ScatterSeriesType;
type StackableSeriesType = BarSeriesType | LineSeriesType;

export {
  BarSeriesType,
  LineSeriesType,
  PieSeriesType,
  ScatterSeriesType,
  AllSeriesType,
  CartesianSeriesType,
  StackableSeriesType,
};
