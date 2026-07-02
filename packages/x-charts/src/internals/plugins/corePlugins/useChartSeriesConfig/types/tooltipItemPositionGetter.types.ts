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
import type { ChartState } from '../../../models';
import type { UseChartCartesianAxisSignature } from '../../../featurePlugins/useChartCartesianAxis';
import type { UseChartInteractionSignature } from '../../../featurePlugins/useChartInteraction';
import type { UseChartTooltipSignature } from '../../../featurePlugins/useChartTooltip';

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
   * The preferred placement of the tooltip related to the element.
   * @default 'top'
   */
  placement: 'top' | 'bottom' | 'left' | 'right';
}) => { x: number; y: number } | null;

/**
 * Computes the anchor position of an item tooltip from the chart state. Series
 * types whose position depends on state the core tooltip plugin doesn't track
 * (e.g. the geo projection for map series) provide one of these instead of a
 * `tooltipItemPositionGetter`, so the dependency is memoized correctly and the
 * feature-specific code stays out of the core bundle.
 * @param {ChartState} state The chart state.
 * @param {'top' | 'bottom' | 'left' | 'right' | undefined} position The preferred placement of the tooltip.
 * @returns {{ x: number; y: number } | null} The tooltip anchor position, or `null` when it cannot be computed.
 */
export type TooltipItemPositionSelector = (
  state: ChartState<
    [UseChartCartesianAxisSignature, UseChartInteractionSignature, UseChartTooltipSignature]
  >,
  position: 'top' | 'bottom' | 'left' | 'right' | undefined,
) => { x: number; y: number } | null;
