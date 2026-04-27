import type { ChartSeriesType, ChartsSeriesConfig } from './config';

export type ComposableCartesianChartSeriesType =
  | 'bar'
  | 'line'
  | 'scatter'
  // @ts-ignore, 'rangeBar' does not exist in the base ChartsSeriesConfig, but it is added via module augmentation in x-charts-premium
  | (ChartsSeriesConfig['rangeBar'] extends undefined ? never : 'rangeBar')
  // @ts-ignore, 'ohlc' does not exist in the base ChartsSeriesConfig, but it is added via module augmentation in x-charts-premium
  | (ChartsSeriesConfig['ohlc'] extends undefined ? never : 'ohlc');

export const composableCartesianSeriesTypes: Set<ComposableCartesianChartSeriesType> = new Set([
  'bar',
  'line',
  'scatter',
  'rangeBar',
  'ohlc',
] as const);

// Idem for radial series

export type ComposableRadialChartSeriesType = 'radialLine' | 'radialBar';

export const composableRadialSeriesTypes: Set<ComposableRadialChartSeriesType> = new Set([
  'radialLine',
  'radialBar',
] as const);

export type ComposableChartSeriesType<SeriesType extends ChartSeriesType> =
  SeriesType extends ComposableCartesianChartSeriesType
    ? ComposableCartesianChartSeriesType
    : SeriesType extends ComposableRadialChartSeriesType
      ? ComposableRadialChartSeriesType
      : SeriesType;
