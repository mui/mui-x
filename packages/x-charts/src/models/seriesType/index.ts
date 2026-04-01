import type { DefaultizedProps, DistributiveOmit } from '@mui/x-internals/types';
import type { ChartSeriesType, ChartsSeriesConfig } from './config';

// Series definition

type AllSeriesType<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[SeriesType]['seriesProp'];

type DefaultizedSeriesType<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[SeriesType]['series'];

// item identifier

export type SeriesItemIdentifier<SeriesType extends ChartSeriesType> = SeriesType extends any
  ? DistributiveOmit<ChartsSeriesConfig[SeriesType]['itemIdentifier'], 'type'>
  : never;

export type SeriesItemIdentifierWithType<SeriesType extends ChartSeriesType> =
  SeriesType extends any ? ChartsSeriesConfig[SeriesType]['itemIdentifier'] : never;

export type SeriesItemIdentifierWithData<SeriesType extends ChartSeriesType> =
  SeriesType extends any ? ChartsSeriesConfig[SeriesType]['itemIdentifierWithData'] : never;

// For now the difference between highlight-identifiers and identifiers is the optional `dataIndex` that allows highlighting a series without specifying a given point.
// If we get more different behaviors, we can move to a pattern similar to `SeriesItemIdentifierWithData` and `SeriesItemIdentifier`.

/**
 * Identifies an highlighted item or series.
 */
export type HighlightItemIdentifier<SeriesType extends ChartSeriesType> = SeriesType extends any
  ? DistributiveOmit<ChartsSeriesConfig[SeriesType]['highlightIdentifier'], 'type'>
  : never;

export type HighlightItemIdentifierWithType<SeriesType extends ChartSeriesType> =
  SeriesType extends any ? ChartsSeriesConfig[SeriesType]['highlightIdentifier'] : never;

export type FocusedItemIdentifier<SeriesType extends ChartSeriesType = ChartSeriesType> =
  SeriesType extends 'line' | 'radar'
    ? DefaultizedProps<ChartsSeriesConfig[SeriesType]['itemIdentifier'], 'dataIndex'>
    : SeriesType extends 'heatmap'
      ? DefaultizedProps<ChartsSeriesConfig[SeriesType]['itemIdentifier'], 'xIndex' | 'yIndex'>
      : ChartsSeriesConfig[SeriesType]['itemIdentifier'];

export { type SeriesId } from './common';
export type { CartesianChartSeriesType, StackableChartSeriesType } from './config';
export * from './line';
export * from './bar';
export * from './scatter';
export * from './pie';
export * from './radar';
export type { AllSeriesType, DefaultizedSeriesType };
