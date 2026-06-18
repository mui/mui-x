import type { ExtendedFeatureCollection, GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import type { SeriesItemIdentifierWithType } from '../../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type {
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
  ComputedXAxis,
  ComputedYAxis,
} from '../../../../../models/axis';
import type { ChartDrawingArea } from '../../../../../hooks/useDrawingArea';
import type { ProcessedSeries, SeriesLayout } from '../../useChartSeries';
import type { ComputeResult } from '../../../featurePlugins/useChartPolarAxis/computeAxisValue';

export type GeoTooltipPosition = {
  geoData: ExtendedFeatureCollection | null;
  projection: GeoProjection | null;
  featureIndexesByName: ReadonlyMap<string, number[]>;
};

export interface TooltipPositionGetterAxesConfig {
  x?: ComputedXAxis;
  y?: ComputedYAxis;
  rotationAxes?: ComputeResult<ChartsRotationAxisProps>;
  radiusAxes?: ComputeResult<ChartsRadiusAxisProps>;
  geo?: GeoTooltipPosition;
}

export type TooltipItemPositionGetter<SeriesType extends ChartSeriesType> = (params: {
  series: ProcessedSeries<SeriesType>;
  axesConfig: TooltipPositionGetterAxesConfig;
  drawingArea: ChartDrawingArea;
  identifier: SeriesItemIdentifierWithType<SeriesType> | null;
  seriesLayout: SeriesLayout<SeriesType>;
  /**
   * The preferred placement of the tooltip related to the element.
   * @default 'top'
   */
  placement: 'top' | 'bottom' | 'left' | 'right';
}) => { x: number; y: number } | null;
