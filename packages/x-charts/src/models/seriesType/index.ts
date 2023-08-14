import { BarItemIdentifier, BarSeriesType, DefaultizedBarSeriesType } from './bar';
import { DefaultizedLineSeriesType, LineItemIdentifier, LineSeriesType } from './line';
import { DefaultizedScatterSeriesType, ScatterItemIdentifier, ScatterSeriesType } from './scatter';
import { DefaultizedPieSeriesType, PieSeriesType, PieItemIdentifier, PieValueType } from './pie';
import { MakeOptional } from '../helpers';

type AllSeriesType =
  | BarSeriesType
  | LineSeriesType
  | ScatterSeriesType
  | PieSeriesType<MakeOptional<PieValueType, 'id'>>;

type CartesianSeriesType = BarSeriesType | LineSeriesType | ScatterSeriesType;

type DefaultizedCartesianSeriesType =
  | DefaultizedBarSeriesType
  | DefaultizedLineSeriesType
  | DefaultizedScatterSeriesType;

type DefaultizedSeriesType = DefaultizedCartesianSeriesType | DefaultizedPieSeriesType;

type StackableSeriesType = DefaultizedBarSeriesType | DefaultizedLineSeriesType;

export type SeriesItemIdentifier =
  | BarItemIdentifier
  | LineItemIdentifier
  | ScatterItemIdentifier
  | PieItemIdentifier;

export * from './line';
export * from './bar';
export * from './scatter';
export * from './pie';
export type { StackOrderType, StackOffsetType } from './common';
export type {
  AllSeriesType,
  CartesianSeriesType,
  DefaultizedSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
};
