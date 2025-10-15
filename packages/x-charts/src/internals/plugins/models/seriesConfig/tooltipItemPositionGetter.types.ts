import type {
  ChartItemIdentifierWithData,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import {
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
  PolarAxisDefaultized,
  ComputedXAxis,
  ComputedYAxis,
} from '../../../../models/axis';
import { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { ProcessedSeries } from '../../corePlugins/useChartSeries';

export interface TooltipPositionGetterAxesConfig {
  x?: ComputedXAxis;
  y?: ComputedYAxis;
  rotation?: PolarAxisDefaultized<any, any, ChartsRotationAxisProps>;
  radius?: PolarAxisDefaultized<any, any, ChartsRadiusAxisProps>;
}

export type TooltipItemPositionGetter<TSeriesType extends ChartSeriesType> = (params: {
  series: ProcessedSeries<TSeriesType>;
  axesConfig: TooltipPositionGetterAxesConfig;
  drawingArea: ChartDrawingArea;
  identifier: ChartItemIdentifierWithData<TSeriesType> | null;
  /**
   * The preferred placement of the tooltip related to the element.
   */
  placement?: 'top' | 'bottom' | 'left' | 'right';
}) => { x: number; y: number } | null;
