import type {
  ChartItemIdentifierWithData,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import {
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
  ComputedXAxis,
  ComputedYAxis,
} from '../../../../models/axis';
import { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { ProcessedSeries } from '../../corePlugins/useChartSeries';
import { ComputeResult } from '../../featurePlugins/useChartPolarAxis/computeAxisValue';

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
  identifier: ChartItemIdentifierWithData<TSeriesType> | null;
  /**
   * The preferred placement of the tooltip related to the element.
   * @default 'top'
   */
  placement: 'top' | 'bottom' | 'left' | 'right';
}) => { x: number; y: number } | null;
