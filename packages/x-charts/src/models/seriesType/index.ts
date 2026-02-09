import type { DefaultizedProps, MakeOptional } from '@mui/x-internals/types';
import { type ChartSeriesType, type ChartsSeriesConfig } from './config';

export type { ChartSeriesType, HighlightScope } from './config';

// Series definition

type AllSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['seriesProp'];

type DefaultizedSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['series'];

// item identifier

export type SeriesItemIdentifier<T extends ChartSeriesType> = T extends ChartSeriesType
  ? ChartsSeriesConfig[T]['itemIdentifier']
  : never;

export type SeriesItemIdentifierWithData<T extends ChartSeriesType> = T extends ChartSeriesType
  ? ChartsSeriesConfig[T]['itemIdentifierWithData']
  : never;

// For now the difference between highlight-identifiers and identifiers is the optional `dataIndex` that allows highlighting a series without a given sepcifying a given point.
// If we get more different we can move to a pattern similar to `SeriesItemIdentifierWithData` and `SeriesItemIdentifier`.
export type HighlightItemIdentifier<T extends ChartSeriesType> = T extends ChartSeriesType
  ? ChartsSeriesConfig[T]['itemIdentifier'] extends { dataIndex?: number }
    ? MakeOptional<ChartsSeriesConfig[T]['itemIdentifier'], 'dataIndex'>
    : ChartsSeriesConfig[T]['itemIdentifier']
  : never;

export type FocusedItemIdentifier<T extends ChartSeriesType = ChartSeriesType> = T extends
  | 'line'
  | 'radar'
  ? DefaultizedProps<ChartsSeriesConfig[T]['itemIdentifier'], 'dataIndex'>
  : T extends 'heatmap'
    ? DefaultizedProps<ChartsSeriesConfig[T]['itemIdentifier'], 'xIndex' | 'yIndex'>
    : ChartsSeriesConfig[T]['itemIdentifier'];

export { type SeriesId } from './common';
export type { CartesianChartSeriesType, StackableChartSeriesType } from './config';
export * from './line';
export * from './bar';
export * from './scatter';
export * from './pie';
export * from './radar';
export type { AllSeriesType, DefaultizedSeriesType };
