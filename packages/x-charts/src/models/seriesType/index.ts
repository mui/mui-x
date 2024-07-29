import { BarSeriesType, DefaultizedBarSeriesType } from './bar';
import {
  CartesianChartSeriesType,
  ChartSeriesType,
  ChartsSeriesConfig,
  StackableChartSeriesType,
} from './config';

// Series definition

type AllSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['seriesProp'];

type CartesianSeriesType = AllSeriesType<CartesianChartSeriesType>;

type DefaultizedSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['series'];

type DefaultizedCartesianSeriesType = DefaultizedSeriesType<CartesianChartSeriesType>;

type StackableSeriesType = DefaultizedSeriesType<StackableChartSeriesType>;

// item identifier

export type SeriesItemIdentifier<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

export * from './line';
export * from './bar';
export * from './scatter';
export * from './pie';
export type {
  AllSeriesType,
  CartesianSeriesType,
  DefaultizedSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
};

// Helpers

export function isDefaultizedBarSeries(
  series: DefaultizedSeriesType,
): series is DefaultizedBarSeriesType {
  return series.type === 'bar';
}

export function isBarSeries(series: AllSeriesType): series is BarSeriesType {
  return series.type === 'bar';
}
