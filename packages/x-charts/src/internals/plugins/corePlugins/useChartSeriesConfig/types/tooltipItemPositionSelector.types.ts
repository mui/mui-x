import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { ChartState } from '../../../models';
import type { UseChartCartesianAxisSignature } from '../../../featurePlugins/useChartCartesianAxis';
import type { UseChartInteractionSignature } from '../../../featurePlugins/useChartInteraction';
import type { UseChartTooltipSignature } from '../../../featurePlugins/useChartTooltip';

/**
 * Computes the anchor position of an item tooltip from the chart state. Each
 * series type provides one of these so it reads only the state it needs (axes,
 * layout, geo projection, …) and the feature-specific code stays out of the core
 * bundle.
 * @param {ChartState} state The chart state.
 * @param {'top' | 'bottom' | 'left' | 'right' | undefined} position The preferred placement of the tooltip.
 * @returns {{ x: number; y: number } | null} The tooltip anchor position, or `null` when it cannot be computed.
 */
export type TooltipItemPositionSelector<SeriesType extends ChartSeriesType> = (
  state: ChartState<
    [
      UseChartCartesianAxisSignature<SeriesType>,
      UseChartInteractionSignature,
      UseChartTooltipSignature<SeriesType>,
    ]
  >,
  position: 'top' | 'bottom' | 'left' | 'right' | undefined,
) => { x: number; y: number } | null;
