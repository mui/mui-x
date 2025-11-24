import { DefaultizedProps, MakeOptional, MakeRequired } from '@mui/x-internals/types';
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
import { DefaultizedRadarSeriesType, RadarItemIdentifier, RadarSeriesType } from './radar';
import { SeriesColor } from './common';

export interface ChartsSeriesConfig {
  bar: {
    /**
     * Series type when passed to the formatter (some ids are given default values to simplify the DX)
     */
    seriesInput: DefaultizedProps<BarSeriesType, 'id'> &
      MakeRequired<SeriesColor<number | null>, 'color'>;
    /**
     * Series type when stored in the context (with all the preprocessing added))
     */
    series: DefaultizedBarSeriesType;
    /**
     * Additional data computed from the series plus drawing area.
     * Usefull for special charts like sankey where the series data is not sufficient to draw the series.
     */
    seriesComputedPosition: {};
    /**
     * Series typing such that the one user need to provide
     */
    seriesProp: BarSeriesType;
    itemIdentifier: BarItemIdentifier;
    itemIdentifierWithData: BarItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    axisType: 'cartesian';
  };
  line: {
    seriesInput: DefaultizedProps<LineSeriesType, 'id'> &
      MakeRequired<SeriesColor<number | null>, 'color'>;
    series: DefaultizedLineSeriesType;
    seriesComputedPosition: {};
    seriesProp: LineSeriesType;
    itemIdentifier: LineItemIdentifier;
    itemIdentifierWithData: LineItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    axisType: 'cartesian';
  };
  scatter: {
    seriesInput: DefaultizedProps<ScatterSeriesType, 'id'> &
      MakeRequired<SeriesColor<ScatterValueType | null>, 'color'>;
    series: DefaultizedScatterSeriesType;
    seriesComputedPosition: {};
    seriesProp: ScatterSeriesType;
    valueType: ScatterValueType;
    itemIdentifier: ScatterItemIdentifier;
    itemIdentifierWithData: ScatterItemIdentifier;
    axisType: 'cartesian';
  };
  pie: {
    seriesInput: Omit<DefaultizedProps<PieSeriesType, 'id'>, 'data'> & {
      data: Array<
        MakeOptional<PieValueType, 'id'> & MakeRequired<SeriesColor<PieValueType | null>, 'color'>
      >;
    };
    series: DefaultizedPieSeriesType;
    seriesComputedPosition: {};
    seriesProp: PieSeriesType<MakeOptional<PieValueType, 'id'>>;
    itemIdentifier: PieItemIdentifier;
    itemIdentifierWithData: PieItemIdentifier;
    valueType: DefaultizedPieValueType;
  };
  radar: {
    seriesInput: DefaultizedProps<RadarSeriesType, 'id'> &
      MakeRequired<SeriesColor<number>, 'color'>;
    series: DefaultizedRadarSeriesType;
    seriesComputedPosition: {};
    seriesProp: RadarSeriesType;
    itemIdentifier: RadarItemIdentifier;
    itemIdentifierWithData: RadarItemIdentifier;
    valueType: number;
    axisType: 'polar';
  };
}

export type ChartSeriesType = keyof ChartsSeriesConfig;

export type CartesianChartSeriesType = keyof Pick<
  ChartsSeriesConfig,
  {
    [Key in ChartSeriesType]: ChartsSeriesConfig[Key] extends { axisType: 'cartesian' }
      ? Key
      : never;
  }[ChartSeriesType]
>;

export type PolarChartSeriesType = keyof Pick<
  ChartsSeriesConfig,
  {
    [Key in ChartSeriesType]: ChartsSeriesConfig[Key] extends { axisType: 'polar' } ? Key : never;
  }[ChartSeriesType]
>;

export type StackableChartSeriesType = keyof Pick<
  ChartsSeriesConfig,
  {
    [Key in ChartSeriesType]: ChartsSeriesConfig[Key] extends { canBeStacked: true } ? Key : never;
  }[ChartSeriesType]
>;

export type ChartSeries<T extends ChartSeriesType> = ChartsSeriesConfig[T]['seriesInput'];

export type ChartSeriesDefaultized<T extends ChartSeriesType> = ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? ChartsSeriesConfig[T]['series'] &
      ChartsSeriesConfig[T]['seriesComputedPosition'] & { stackedData: [number, number][] }
  : ChartsSeriesConfig[T]['series'] & ChartsSeriesConfig[T]['seriesComputedPosition'];

export type ChartItemIdentifier<T extends ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifier'];

export type ChartItemIdentifierWithData<T extends ChartSeriesType> =
  ChartsSeriesConfig[T]['itemIdentifierWithData'];

export type DatasetElementType<T> = {
  [key: string]: T;
};
export type DatasetType<T = unknown> = DatasetElementType<T>[];
