import { DefaultizedProps, MakeRequired } from '@mui/x-internals/types';
import { AxisId, ZoomOptions } from '@mui/x-charts/internals';
import {
  DefaultizedFunnelSeriesType,
  FunnelItemIdentifier,
  FunnelSeriesType,
  FunnelValueType,
} from '../FunnelChart/funnel.types';
import {
  HeatmapItemIdentifier,
  HeatmapSeriesType,
  DefaultizedHeatmapSeriesType,
  HeatmapValueType,
} from '../models/seriesType/heatmap';
import {
  SankeyLayout,
  SankeySeriesType,
  type DefaultizedSankeySeriesType,
  type SankeyItemIdentifier,
  type SankeyItemIdentifierWithData,
} from '../SankeyChart/sankey.types';

declare module '@mui/x-charts/internals' {
  interface ChartsSeriesConfig {
    heatmap: {
      seriesInput: DefaultizedProps<HeatmapSeriesType, 'id'>;
      series: DefaultizedHeatmapSeriesType;
      seriesComputedPosition: {};
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
      seriesComputedPosition: {};
      seriesProp: FunnelSeriesType;
      itemIdentifier: FunnelItemIdentifier;
      itemIdentifierWithData: FunnelItemIdentifier;
      valueType: MakeRequired<FunnelValueType, 'id' | 'color'>;
      axisType: 'cartesian';
    };
    sankey: {
      seriesInput: DefaultizedSankeySeriesType;
      series: DefaultizedSankeySeriesType;
      seriesComputedPosition: {
        sankeyLayout: SankeyLayout;
      };
      seriesProp: SankeySeriesType;
      itemIdentifier: SankeyItemIdentifier;
      itemIdentifierWithData: SankeyItemIdentifierWithData;
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
