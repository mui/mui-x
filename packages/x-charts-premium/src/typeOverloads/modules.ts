import type { DefaultizedProps, MakeRequired } from '@mui/x-internals/types';
import type {
  CommonHighlightScope,
  SeriesColor,
  SeriesId,
  ComputedXAxis,
  ComputedYAxis,
  PolarAxisDefaultized,
  ChartsRadiusAxisProps,
  ChartsRotationAxisProps,
} from '@mui/x-charts/internals';
import type {
  RangeBarValueType,
  RangeBarSeriesType,
  DefaultizedOHLCSeriesType,
  OHLCItemIdentifier,
  OHLCSeriesType,
  OHLCValueType,
  RadialLineSeriesType,
  DefaultizedRadialLineSeriesType,
  RadialLineItemIdentifier,
} from '../models';
import type {
  DefaultizedRangeBarSeriesType,
  RangeBarItemIdentifier,
} from '../models/seriesType/rangeBar';
import type { BarSeries } from '../BarChart';

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
  }
}
