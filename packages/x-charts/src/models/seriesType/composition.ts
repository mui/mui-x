import type { ChartSeriesType, ChartsSeriesConfig } from './config';

export type ComposableCartesianChartSeriesType =
  | 'bar'
  | 'line'
  | 'scatter'
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Range bar is added by Premium augmentation, absent in the community build.
  // @ts-ignore Range bar is added by Premium augmentation, absent in the community build.
  | (ChartsSeriesConfig['rangeBar'] extends undefined ? never : 'rangeBar')
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- OHLC is added by Premium augmentation, absent in the community build.
  // @ts-ignore OHLC is added by Premium augmentation, absent in the community build.
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
