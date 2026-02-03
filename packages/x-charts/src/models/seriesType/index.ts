import type { DefaultizedProps } from '@mui/x-internals/types';
import { type ChartSeriesType, type ChartsSeriesConfig } from './config';

// Series definition

type AllSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['seriesProp'];

type DefaultizedSeriesType<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['series'];

// item identifier

export type SeriesItemIdentifier<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

export type SeriesItemIdentifierWithData<T extends ChartSeriesType = ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifierWithData'];

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
