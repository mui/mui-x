import { type DefaultizedProps, type MakeRequired } from '@mui/x-internals/types';
import {
  type CommonHighlightScope,
  type SeriesColor,
  type SeriesId,
  type ComputedXAxis,
  type ComputedYAxis,
  type PolarAxisDefaultized,
  type ChartsRadiusAxisProps,
  type ChartsRotationAxisProps,
} from '@mui/x-charts/internals';
import {
  type RangeBarValueType,
  type RangeBarSeriesType,
  type DefaultizedOHLCSeriesType,
  type OHLCItemIdentifier,
  type OHLCSeriesType,
  type OHLCValueType,
  type RadialLineSeriesType,
  type DefaultizedRadialLineSeriesType,
  type RadialLineItemIdentifier,
  type RadialBarSeriesType,
  type DefaultizedRadialBarSeriesType,
  type RadialBarItemIdentifier,
  type MapShapeSeriesType,
  type DefaultizedMapShapeSeriesType,
  type MapShapeItemIdentifier,
  type MapShapeValueType,
} from '../models';
import {
  type DefaultizedRangeBarSeriesType,
  type RangeBarItemIdentifier,
} from '../models/seriesType/rangeBar';
import { type BarSeries } from '../BarChart';

declare module '@mui/x-charts/internals' {
  interface UseBarChartPropsExtensions {
    series: ReadonlyArray<BarSeries | RangeBarSeriesType>;
  }

  interface ChartsSeriesConfig {
    rangeBar: {
      seriesInput: DefaultizedProps<RangeBarSeriesType, 'id'> &
        MakeRequired<SeriesColor<RangeBarValueType | null>, 'color'>;
      series: DefaultizedRangeBarSeriesType;
      seriesLayout: {};
      seriesProp: RangeBarSeriesType;
      itemIdentifier: RangeBarItemIdentifier;
      itemIdentifierWithData: RangeBarItemIdentifier;
      valueType: RangeBarValueType | null;
      axisType: 'cartesian';
      highlightScope: CommonHighlightScope;
      descriptionGetterParams: {
        identifier: RangeBarItemIdentifier;
        xAxis: ComputedXAxis;
        yAxis: ComputedYAxis;
        series: DefaultizedRangeBarSeriesType;
      };
      highlightIdentifier: {
        type: 'rangeBar';
        seriesId: SeriesId;
        dataIndex?: number;
      };
    };
    ohlc: {
      seriesInput: DefaultizedProps<OHLCSeriesType, 'id'> &
        MakeRequired<SeriesColor<OHLCValueType | null>, 'color'> &
        Pick<DefaultizedOHLCSeriesType, 'upColor' | 'downColor'>;
      series: DefaultizedOHLCSeriesType;
      seriesLayout: {};
      seriesProp: OHLCSeriesType;
      itemIdentifier: OHLCItemIdentifier;
      itemIdentifierWithData: OHLCItemIdentifier;
      valueType: OHLCValueType | null;
      axisType: 'cartesian';
      highlightScope: CommonHighlightScope;
      descriptionGetterParams: {
        identifier: OHLCItemIdentifier;
        xAxis: ComputedXAxis;
        yAxis: ComputedYAxis;
        series: DefaultizedOHLCSeriesType;
      };
      highlightIdentifier: {
        type: 'ohlc';
        seriesId: SeriesId;
        dataIndex?: number;
      };
    };
    radialLine: {
      seriesInput: DefaultizedProps<RadialLineSeriesType, 'id'> &
        MakeRequired<SeriesColor<number | null>, 'color'>;
      series: DefaultizedRadialLineSeriesType;
      seriesLayout: {};
      seriesProp: RadialLineSeriesType;
      itemIdentifier: RadialLineItemIdentifier;
      itemIdentifierWithData: RadialLineItemIdentifier;
      valueType: number | null;
      canBeStacked: true;
      axisType: 'polar';
      highlightScope: CommonHighlightScope;
      descriptionGetterParams: {
        identifier: RadialLineItemIdentifier;
        rotationAxis: PolarAxisDefaultized<any, any, ChartsRotationAxisProps>;
        radiusAxis: PolarAxisDefaultized<any, any, ChartsRadiusAxisProps>;
        series: DefaultizedRadialLineSeriesType;
      };
      highlightIdentifier: {
        type: 'radialLine';
        seriesId: SeriesId;
        dataIndex?: number;
      };
    };
    mapShape: {
      seriesInput: DefaultizedProps<MapShapeSeriesType, 'id'> &
        MakeRequired<SeriesColor<MapShapeValueType>, 'color'>;
      series: DefaultizedMapShapeSeriesType;
      seriesLayout: {};
      seriesProp: MapShapeSeriesType;
      itemIdentifier: MapShapeItemIdentifier;
      itemIdentifierWithData: MapShapeItemIdentifier;
      valueType: MapShapeValueType;
      highlightScope: CommonHighlightScope;
      descriptionGetterParams: {
        identifier: MapShapeItemIdentifier;
        series: DefaultizedMapShapeSeriesType;
      };
      highlightIdentifier: MapShapeItemIdentifier;
    };
    radialBar: {
      seriesInput: DefaultizedProps<RadialBarSeriesType, 'id'> &
        MakeRequired<SeriesColor<number | null>, 'color'>;
      series: DefaultizedRadialBarSeriesType;
      seriesLayout: {};
      seriesProp: RadialBarSeriesType;
      itemIdentifier: RadialBarItemIdentifier;
      itemIdentifierWithData: RadialBarItemIdentifier;
      valueType: number | null;
      canBeStacked: true;
      axisType: 'polar';
      highlightScope: CommonHighlightScope;
      descriptionGetterParams: {
        identifier: RadialBarItemIdentifier;
        rotationAxis: PolarAxisDefaultized<any, any, ChartsRotationAxisProps>;
        radiusAxis: PolarAxisDefaultized<any, any, ChartsRadiusAxisProps>;
        series: DefaultizedRadialBarSeriesType;
      };
      highlightIdentifier: {
        type: 'radialBar';
        seriesId: SeriesId;
        dataIndex: number;
      };
    };
  }
}
