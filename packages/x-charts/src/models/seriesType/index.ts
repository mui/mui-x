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

/**
 * @deprecated We do not use this type in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */
type CartesianSeriesType = AllSeriesType<CartesianChartSeriesType>;

type DefaultizedSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['series'];

/**
 * @deprecated We do not use this type in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */
type DefaultizedCartesianSeriesType = DefaultizedSeriesType<CartesianChartSeriesType>;

/**
 * @deprecated We do not use this type in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */
type StackableSeriesType = DefaultizedSeriesType<StackableChartSeriesType>;

// item identifier

export type SeriesItemIdentifier<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

export * from './line';
export * from './bar';
export * from './scatter';
export * from './pie';
export * from './radar';
export type {
  AllSeriesType,
  DefaultizedSeriesType,
  CartesianSeriesType,
  DefaultizedCartesianSeriesType,
  StackableSeriesType,
};

// Helpers

/**
 * @deprecated We do not use this function in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */
export function isDefaultizedBarSeries(
  series: DefaultizedSeriesType,
): series is DefaultizedBarSeriesType {
  return series.type === 'bar';
}

/**
 * @deprecated We do not use this function in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */
export function isBarSeries(series: AllSeriesType): series is BarSeriesType {
  return series.type === 'bar';
}
