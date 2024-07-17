import { DefaultizedProps } from '@mui/x-charts/internals';
import {
  HeatmapItemIdentifier,
  HeatmapSeriesType,
  DefaultizedHeatmapSeriesType,
} from '../models/seriesType/heatmap';
import { ZoomOptions } from '../context/ZoomProvider';

declare module '@mui/x-charts/internals' {
  interface ChartsSeriesConfig {
    heatmap: {
      seriesInput: DefaultizedProps<HeatmapSeriesType, 'id'>;
      series: DefaultizedHeatmapSeriesType;
      seriesProp: HeatmapSeriesType;
      itemIdentifier: HeatmapItemIdentifier;
      cartesian: true;
    };
  }

  interface AxisConfigExtension {
    zoom?: boolean | ZoomOptions;
  }
}
