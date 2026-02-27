import type { ChartSeriesType } from './config';

export type ComposableCartesianChartSeriesType =
  | 'bar'
  | 'line'
  | 'scatter'
  | ('rangeBar' extends ChartSeriesType ? 'rangeBar' : never);

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
