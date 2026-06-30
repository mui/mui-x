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
   * The chart store. Lets a series type read additional state it needs to
   * position its tooltip (e.g. the geo projection for map series) without the
   * core tooltip plugin having to depend on feature-specific code.
   */
  store: ChartStore;
  /**
   * The preferred placement of the tooltip related to the element.
   * @default 'top'
   */
  placement: 'top' | 'bottom' | 'left' | 'right';
}) => { x: number; y: number } | null;
