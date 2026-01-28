import { type DefaultizedProps, type MakeRequired } from '@mui/x-internals/types';
import { type AxisId, type ZoomOptions } from '@mui/x-charts/internals';
import {
  type DefaultizedFunnelSeriesType,
  type FunnelItemIdentifier,
  type FunnelSeriesType,
  type FunnelValueType,
} from '../FunnelChart/funnel.types';
import {
  type HeatmapItemIdentifier,
  type HeatmapSeriesType,
  type DefaultizedHeatmapSeriesType,
  type HeatmapValueType,
} from '../models/seriesType/heatmap';
import {
  type SankeyLayout,
  type SankeySeriesType,
  type DefaultizedSankeySeriesType,
  type SankeyItemIdentifier,
  type SankeyItemIdentifierWithData,
} from '../SankeyChart/sankey.types';

declare module '@mui/x-charts/internals' {
  interface ChartsSeriesConfig {
    heatmap: {
      seriesInput: DefaultizedProps<HeatmapSeriesType, 'id'>;
      series: DefaultizedHeatmapSeriesType;
      seriesLayout: {};
      seriesProp: HeatmapSeriesType;
      itemIdentifier: HeatmapItemIdentifier;
      itemIdentifierWithData: HeatmapItemIdentifier;
      valueType: HeatmapValueType;
      axisType: 'cartesian';
    };
    funnel: {
      seriesInput: Omit<DefaultizedProps<FunnelSeriesType, 'id'>, 'data'> & {
        data: MakeRequired<FunnelValueType, 'color'>[];
      };
      series: DefaultizedFunnelSeriesType;
      seriesLayout: {};
      seriesProp: FunnelSeriesType;
      itemIdentifier: FunnelItemIdentifier;
      itemIdentifierWithData: FunnelItemIdentifier;
      valueType: MakeRequired<FunnelValueType, 'id' | 'color'>;
      axisType: 'cartesian';
    };
    sankey: {
      seriesInput: DefaultizedSankeySeriesType;
      series: DefaultizedSankeySeriesType;
      seriesLayout: {
        sankeyLayout: SankeyLayout<true>;
      };
      seriesProp: SankeySeriesType;
      itemIdentifier: SankeyItemIdentifier;
      itemIdentifierWithData: SankeyItemIdentifierWithData<true>;
      valueType: number;
    };
  }

  interface DefaultizedZoomOptions extends Required<ZoomOptions> {
    axisId: AxisId;
    axisDirection: 'x' | 'y';
  }

  interface AxisConfigExtension {
    zoom?: boolean | ZoomOptions;
  }
}
