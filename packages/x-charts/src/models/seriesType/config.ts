import type { DefaultizedProps, MakeOptional, MakeRequired } from '@mui/x-internals/types';
import type {
  ScatterSeriesType,
  DefaultizedScatterSeriesType,
  ScatterItemIdentifier,
  ScatterValueType,
} from './scatter';
import type { LineSeriesType, DefaultizedLineSeriesType, LineItemIdentifier } from './line';
import type { BarItemIdentifier, BarSeriesType, DefaultizedBarSeriesType } from './bar';
import type {
  PieSeriesType,
  DefaultizedPieSeriesType,
  PieItemIdentifier,
  PieValueType,
  DefaultizedPieValueType,
  PieSeriesLayout,
} from './pie';
import type { DefaultizedRadarSeriesType, RadarItemIdentifier, RadarSeriesType } from './radar';
import type { SeriesColor, SeriesId } from './common';
import type { CommonHighlightScope } from '../../internals/plugins/featurePlugins/useChartHighlight/highlightConfig.types';

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
     * Useful for special charts like sankey where the series data is not sufficient to draw the series.
     * */
    seriesLayout: {};
    /**
     * Series typing such that the one user need to provide
     */
    seriesProp: BarSeriesType;
    /**
     * The minimal information to identify a specific item in the series.
     */
    itemIdentifier: BarItemIdentifier;
    /**
     * The minimal information to identify a specific item in the series. Plus the data associated to it.
     */
    itemIdentifierWithData: BarItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    axisType: 'cartesian';
    highlightScope: CommonHighlightScope;
    highlightIdentifier: {
      type: 'bar';
      seriesId: SeriesId;
      dataIndex?: number | undefined;
    };
  };
  line: {
    seriesInput: DefaultizedProps<LineSeriesType, 'id'> &
      MakeRequired<SeriesColor<number | null>, 'color'>;
    series: DefaultizedLineSeriesType;
    seriesLayout: {};
    seriesProp: LineSeriesType;
    itemIdentifier: LineItemIdentifier;
    itemIdentifierWithData: LineItemIdentifier;
    valueType: number | null;
    canBeStacked: true;
    axisType: 'cartesian';
    highlightScope: CommonHighlightScope;
    highlightIdentifier: {
      type: 'line';
      seriesId: SeriesId;
      dataIndex?: number;
    };
  };
  scatter: {
    seriesInput: DefaultizedProps<ScatterSeriesType, 'id'> &
      MakeRequired<SeriesColor<ScatterValueType | null>, 'color'>;
    series: DefaultizedScatterSeriesType;
    seriesLayout: {};
    seriesProp: ScatterSeriesType;
    valueType: ScatterValueType;
    itemIdentifier: ScatterItemIdentifier;
    itemIdentifierWithData: ScatterItemIdentifier;
    axisType: 'cartesian';
    highlightScope: CommonHighlightScope;
    highlightIdentifier: {
      type: 'scatter';
      seriesId: SeriesId;
      dataIndex?: number;
    };
  };
  pie: {
    seriesInput: Omit<DefaultizedProps<PieSeriesType, 'id'>, 'data'> & {
      data: Array<
        MakeOptional<PieValueType, 'id'> & MakeRequired<SeriesColor<PieValueType | null>, 'color'>
      >;
    };
    series: DefaultizedPieSeriesType;
    seriesLayout: PieSeriesLayout;
    seriesProp: PieSeriesType<MakeOptional<PieValueType, 'id'>>;
    itemIdentifier: PieItemIdentifier;
    itemIdentifierWithData: PieItemIdentifier;
    valueType: DefaultizedPieValueType;
    highlightScope: CommonHighlightScope;
    highlightIdentifier: {
      type: 'pie';
      seriesId: SeriesId;
      dataIndex?: number;
    };
  };
  radar: {
    seriesInput: DefaultizedProps<RadarSeriesType, 'id'> &
      MakeRequired<SeriesColor<number>, 'color'>;
    series: DefaultizedRadarSeriesType;
    seriesLayout: {};
    seriesProp: RadarSeriesType;
    itemIdentifier: RadarItemIdentifier;
    itemIdentifierWithData: RadarItemIdentifier;
    valueType: number;
    axisType: 'polar';
    highlightScope: CommonHighlightScope;
    highlightIdentifier: {
      type: 'radar';
      seriesId: SeriesId;
      dataIndex?: number;
    };
  };
}

/**
 * All the existing series types.
 */
export type ChartSeriesType = keyof ChartsSeriesConfig;

export type CartesianChartSeriesType = keyof Pick<
  ChartsSeriesConfig,
  {
    [Key in ChartSeriesType]: ChartsSeriesConfig[Key] extends { axisType: 'cartesian' }
      ? Key
      : never;
  }[ChartSeriesType]
>;

/**
 * Extracts series types whose itemIdentifier includes a `dataIndex` property.
 * This prevents accidentally using dataIndex-based cleaners/serializers
 * for series types that use different identifier properties (e.g., heatmap uses xIndex/yIndex).
 */
export type SeriesTypeWithDataIndex = {
  [K in ChartSeriesType]: 'dataIndex' extends keyof ChartsSeriesConfig[K]['itemIdentifier']
    ? K
    : never;
}[ChartSeriesType];

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

export type ChartSeries<SeriesType extends ChartSeriesType> =
  ChartsSeriesConfig[SeriesType]['seriesInput'];

export type ChartSeriesDefaultized<SeriesType extends ChartSeriesType> =
  ChartsSeriesConfig[SeriesType] extends {
    canBeStacked: true;
  }
    ? ChartsSeriesConfig[SeriesType]['series'] & {
        visibleStackedData: [number, number][];
        stackedData: [number, number][];
      }
    : ChartsSeriesConfig[SeriesType]['series'];

export type ChartSeriesLayout<SeriesType extends ChartSeriesType> =
  ChartsSeriesConfig[SeriesType] extends any
    ? ChartsSeriesConfig[SeriesType]['seriesLayout']
    : never;

export type DatasetElementType<T> = {
  [key: string]: T;
};
export type DatasetType<T = unknown> = DatasetElementType<T>[];

export type HighlightScope<SeriesType extends ChartSeriesType> =
  ChartsSeriesConfig[SeriesType] extends any
    ? ChartsSeriesConfig[SeriesType]['highlightScope']
    : never;
