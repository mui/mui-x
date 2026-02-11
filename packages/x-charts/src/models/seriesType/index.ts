import type { DefaultizedProps } from '@mui/x-internals/types';
import { type ChartSeriesType, type ChartsSeriesConfig } from './config';

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

export type FocusedItemIdentifier<T extends ChartSeriesType = ChartSeriesType> = T extends
  | 'line'
  | 'radar'
  ? DefaultizedProps<ChartsSeriesConfig[T]['itemIdentifier'], 'dataIndex'>
  : T extends 'heatmap'
    ? DefaultizedProps<ChartsSeriesConfig[T]['itemIdentifier'], 'xIndex' | 'yIndex'>
    : ChartsSeriesConfig[T]['itemIdentifier'];

export type FocusedItemValues<T extends ChartSeriesType = ChartSeriesType> = T extends
  | 'line'
  | 'bar'
  | 'radar'
  ? {
      axisLabel?: string;
      axisValue?: { toString(): string };
      seriesLabel?: string;
      seriesValue?: ChartsSeriesConfig[T]['valueType'];
    }
  : T extends 'scatter'
    ? {
        xLabel?: string;
        xValue?: ChartsSeriesConfig['scatter']['valueType']['x'];
        yLabel?: string;
        yValue?: ChartsSeriesConfig['scatter']['valueType']['y'];
        zLabel?: string;
        zValue?: ChartsSeriesConfig['scatter']['valueType']['z'];
        seriesLabel?: string;
        seriesValue?: { toString(): string };
      }
    : null;

export { type SeriesId } from './common';
export type { CartesianChartSeriesType, StackableChartSeriesType } from './config';
export * from './line';
export * from './bar';
export * from './scatter';
export * from './pie';
export * from './radar';
export type { AllSeriesType, DefaultizedSeriesType };
