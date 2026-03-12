import type { ChartSeriesType, ChartsSeriesConfig } from './config';

export type ComposableCartesianChartSeriesType =
  | 'bar'
  | 'line'
  | 'scatter'
  // @ts-ignore, 'rangeBar' does not exist in the base ChartsSeriesConfig, but it is added via module augmentation in x-charts-premium
  | (ChartsSeriesConfig['rangeBar'] extends undefined ? never : 'rangeBar');

export const composableCartesianSeriesTypes: Set<ComposableCartesianChartSeriesType> = new Set([
  'bar',
  'line',
  'scatter',
  'rangeBar',
] as ComposableCartesianChartSeriesType[]);

export type ComposableChartSeriesType<SeriesType extends ChartSeriesType> =
  SeriesType extends ComposableCartesianChartSeriesType
    ? ComposableCartesianChartSeriesType
    : SeriesType;
