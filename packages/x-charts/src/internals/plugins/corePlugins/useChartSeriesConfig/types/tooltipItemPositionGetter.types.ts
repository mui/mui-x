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
import type { ChartStore } from '../../../models';

export interface TooltipPositionGetterAxesConfig {
  x?: ComputedXAxis;
  y?: ComputedYAxis;
  rotationAxes?: ComputeResult<ChartsRotationAxisProps>;
  radiusAxes?: ComputeResult<ChartsRadiusAxisProps>;
}

export type TooltipItemPositionGetter<SeriesType extends ChartSeriesType> = (params: {
  series: ProcessedSeries<SeriesType>;
  axesConfig: TooltipPositionGetterAxesConfig;
  drawingArea: ChartDrawingArea;
  identifier: SeriesItemIdentifierWithType<SeriesType> | null;
  seriesLayout: SeriesLayout<SeriesType>;
  /**
   * The chart store, letting a series type read extra state to position its
   * tooltip (e.g. the geo projection for map series).
   */
  store: ChartStore;
  /**
   * The preferred placement of the tooltip related to the element.
   * @default 'top'
   */
  placement: 'top' | 'bottom' | 'left' | 'right';
}) => { x: number; y: number } | null;
