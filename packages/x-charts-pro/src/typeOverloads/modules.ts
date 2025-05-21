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
      axisExtension: {
        /**
         * The gap, in pixels, between funnel sections.
         * @default 0
         */
        gap?: number;
      };
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
