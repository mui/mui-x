import { DefaultizedProps, MakeRequired } from '@mui/x-internals/types';
import { AxisId } from '@mui/x-charts/internals';
import {
  HeatmapItemIdentifier,
  HeatmapSeriesType,
  DefaultizedHeatmapSeriesType,
  HeatmapValueType,
} from '../models/seriesType/heatmap';
import { ZoomOptions as ZoomOptionsPro } from '../internals/plugins/useChartProZoom/zoom.types';
import {
  DefaultizedFunnelSeriesType,
  FunnelItemIdentifier,
  FunnelSeriesType,
  FunnelValueType,
} from '../FunnelChart/funnel.types';

declare module '@mui/x-charts/internals' {
  interface ChartsSeriesConfig {
    heatmap: {
      seriesInput: DefaultizedProps<HeatmapSeriesType, 'id'>;
      series: DefaultizedHeatmapSeriesType;
      seriesProp: HeatmapSeriesType;
      itemIdentifier: HeatmapItemIdentifier;
      valueType: HeatmapValueType;
      cartesian: true;
    };
    funnel: {
      seriesInput: Omit<DefaultizedProps<FunnelSeriesType, 'id'>, 'data'> & {
        data: MakeRequired<FunnelValueType, 'color'>[];
      };
      series: DefaultizedFunnelSeriesType;
      seriesProp: FunnelSeriesType;
      itemIdentifier: FunnelItemIdentifier;
      valueType: FunnelValueType;
      cartesian: true;
    };
  }

  interface ZoomOptions extends ZoomOptionsPro {}

  interface DefaultizedZoomOptions extends Required<ZoomOptionsPro> {
    axisId: AxisId;
    axisDirection: 'x' | 'y';
  }

  interface AxisConfigExtension {
    zoom?: boolean | ZoomOptions;
  }
}
