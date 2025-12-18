import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import {
  type ChartsRotationAxisProps,
  type ChartsRadiusAxisProps,
  type ComputedXAxis,
  type ComputedYAxis,
} from '../../../../models/axis';
import { type ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { type ProcessedSeries, type SeriesLayout } from '../../corePlugins/useChartSeries';
import { type ComputeResult } from '../../featurePlugins/useChartPolarAxis/computeAxisValue';

export interface TooltipPositionGetterAxesConfig {
  x?: ComputedXAxis;
  y?: ComputedYAxis;
  rotationAxes?: ComputeResult<ChartsRotationAxisProps>;
  radiusAxes?: ComputeResult<ChartsRadiusAxisProps>;
}

export type TooltipItemPositionGetter<TSeriesType extends ChartSeriesType> = (params: {
  series: ProcessedSeries<TSeriesType>;
  axesConfig: TooltipPositionGetterAxesConfig;
  drawingArea: ChartDrawingArea;
  identifier: SeriesItemIdentifier<TSeriesType> | null;
  seriesLayout: SeriesLayout<TSeriesType>;
  /**
   * The preferred placement of the tooltip related to the element.
   * @default 'top'
   */
  placement: 'top' | 'bottom' | 'left' | 'right';
}) => { x: number; y: number } | null;
