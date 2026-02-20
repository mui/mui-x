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

type TypeMapping = {
  bar: ComposableCartesianChartSeriesType;
  line: ComposableCartesianChartSeriesType;
  scatter: ComposableCartesianChartSeriesType;
  rangeBar: ComposableCartesianChartSeriesType;
  pie: 'pie';
  sankey: 'sankey';
  radar: 'radar';
  funnel: 'funnel';
  heatmap: 'heatmap';
};

export type ComposableChartSeriesType<SeriesType extends ChartSeriesType> =
  SeriesType extends keyof TypeMapping ? TypeMapping[SeriesType] : never;
