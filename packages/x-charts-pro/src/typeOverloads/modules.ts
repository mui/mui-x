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
  SankeySeriesType,
  type DefaultizedSankeySeriesType,
  type SankeyItemIdentifier,
  type SankeyValueType,
} from '../SankeyChart/sankey.types';

declare module '@mui/x-charts/internals' {
  interface ChartsSeriesConfig {
    heatmap: {
      seriesInput: DefaultizedProps<HeatmapSeriesType, 'id'>;
      series: DefaultizedHeatmapSeriesType;
      seriesProp: HeatmapSeriesType;
      itemIdentifier: HeatmapItemIdentifier;
      valueType: HeatmapValueType;
      axisType: 'cartesian';
    };
    funnel: {
      seriesInput: Omit<DefaultizedProps<FunnelSeriesType, 'id'>, 'data'> & {
        data: MakeRequired<FunnelValueType, 'color'>[];
      };
      series: DefaultizedFunnelSeriesType;
      seriesProp: FunnelSeriesType;
      itemIdentifier: FunnelItemIdentifier;
      valueType: MakeRequired<FunnelValueType, 'id' | 'color'>;
      axisType: 'cartesian';
    };
    sankey: {
      seriesInput: DefaultizedProps<SankeySeriesType, 'id'>;
      series: DefaultizedSankeySeriesType;
      seriesProp: SankeySeriesType;
      itemIdentifier: SankeyItemIdentifier;
      valueType: SankeyValueType;
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
