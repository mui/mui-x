import type { ChartSeriesType } from './config';

export type ComposableCartesianChartSeriesType =
  | 'bar'
  | 'line'
  | 'scatter'
  // Range bar and OHLC series only exist when the Premium package augments `ChartsSeriesConfig`.
  | Extract<ChartSeriesType, 'rangeBar' | 'ohlc'>;

/**
 * The cartesian series types that can be composed in the same chart.
 * Packages adding composable series types (for example range bar and OHLC in Premium) register them in this set.
 */
export const composableCartesianSeriesTypes: Set<ComposableCartesianChartSeriesType> = new Set([
  'bar',
  'line',
  'scatter',
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
