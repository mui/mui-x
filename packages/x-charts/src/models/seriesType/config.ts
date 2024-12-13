import { DefaultizedProps, MakeOptional } from '@mui/x-internals/types';
import {
  ScatterSeriesType,
  DefaultizedScatterSeriesType,
  ScatterItemIdentifier,
  ScatterValueType,
} from './scatter';
import { LineSeriesType, DefaultizedLineSeriesType, LineItemIdentifier } from './line';
import { BarItemIdentifier, BarSeriesType, DefaultizedBarSeriesType } from './bar';
import {
  PieSeriesType,
  DefaultizedPieSeriesType,
  PieItemIdentifier,
  PieValueType,
  DefaultizedPieValueType,
} from './pie';

export interface ChartsSeriesConfig {
  bar: {
    /**
     * Series type when passed to the formatter (some ids are given default values to simplify the DX)
     */
    seriesInput: DefaultizedProps<BarSeriesType, 'id'> & { color: string };
    /**
     * Series type when stored in the context (with all the preprocessing added))
     */
    series: DefaultizedBarSeriesType;
    /**
     * Series typing such that the one user need to provide
     */
    seriesProp: BarSeriesType;
    itemIdentifier: BarItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    cartesian: true;
  };
  line: {
    seriesInput: DefaultizedProps<LineSeriesType, 'id'> & { color: string };
    series: DefaultizedLineSeriesType;
    seriesProp: LineSeriesType;
    itemIdentifier: LineItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    cartesian: true;
  };
  scatter: {
    seriesInput: DefaultizedProps<ScatterSeriesType, 'id'> & { color: string };
    series: DefaultizedScatterSeriesType;
    seriesProp: ScatterSeriesType;
    valueType: ScatterValueType;
    itemIdentifier: ScatterItemIdentifier;
    cartesian: true;
  };
  pie: {
    seriesInput: Omit<DefaultizedProps<PieSeriesType, 'id'>, 'data'> & {
      data: (MakeOptional<PieValueType, 'id'> & { color: string })[];
    };
    series: DefaultizedPieSeriesType;
    seriesProp: PieSeriesType<MakeOptional<PieValueType, 'id'>>;
    itemIdentifier: PieItemIdentifier;
    valueType: DefaultizedPieValueType;
  };
}

export type ChartSeriesType = keyof ChartsSeriesConfig;

export type CartesianChartSeriesType = keyof Pick<
  ChartsSeriesConfig,
  {
    [Key in ChartSeriesType]: ChartsSeriesConfig[Key] extends { cartesian: true } ? Key : never;
  }[ChartSeriesType]
>;

export type StackableChartSeriesType = keyof Pick<
  ChartsSeriesConfig,
  {
    [Key in ChartSeriesType]: ChartsSeriesConfig[Key] extends { canBeStacked: true } ? Key : never;
  }[ChartSeriesType]
>;

export type ChartSeries<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? ChartsSeriesConfig[T]['seriesInput'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['seriesInput'];

export type ChartSeriesDefaultized<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? ChartsSeriesConfig[T]['series'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['series'];

export type ChartItemIdentifier<T extends ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

export type DatasetElementType<T> = {
  [key: string]: T;
};
export type DatasetType<T = number | string | Date | null | undefined> = DatasetElementType<T>[];
