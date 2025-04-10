import { ChartSeriesType, ChartsSeriesConfig } from './config';

// Series definition

type AllSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['seriesProp'];

type DefaultizedSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['series'];

// item identifier

export type SeriesItemIdentifier<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

export * from './line';
export * from './bar';
export * from './scatter';
export * from './pie';
export * from './radar';
export type { AllSeriesType, DefaultizedSeriesType };
