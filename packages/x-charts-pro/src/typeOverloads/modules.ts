import { DefaultizedProps } from '@mui/x-internals/types';
import { AxisId } from '@mui/x-charts/internals';
import {
  HeatmapItemIdentifier,
  HeatmapSeriesType,
  DefaultizedHeatmapSeriesType,
  HeatmapValueType,
} from '../models/seriesType/heatmap';
import { ZoomOption as ZoomOptionPro } from '../internals/plugins/useChartProZoom/zoom.types';

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
  }

  interface ZoomOption extends ZoomOptionPro {}

  interface DefaultizedZoomOption extends Required<ZoomOptionPro> {
    axisId: AxisId;
    axisDirection: 'x' | 'y';
  }

  interface AxisConfigExtension {
    zoom?: boolean | ZoomOption;
  }
}
