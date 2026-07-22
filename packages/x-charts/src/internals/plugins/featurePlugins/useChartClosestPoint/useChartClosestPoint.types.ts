import type { ItemActivationEvent } from '../../../../models/featureFlags';
import type { ScatterItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import type { ChartPluginSignature } from '../../models';
import type { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import type { UseChartHighlightSignature } from '../useChartHighlight';
import type { UseChartInteractionSignature } from '../useChartInteraction';
import type { UseChartTooltipSignature } from '../useChartTooltip';
import type { UseChartZAxisSignature } from '../useChartZAxis';

export interface UseChartVoronoiInstance {
  /**
   * Enable the voronoi computation.
   */
  enableVoronoi: () => void;
  /**
   * Disable the voronoi computation.
   */
  disableVoronoi: () => void;
}

export interface UseChartVoronoiState {
  voronoi: {
    /**
     * Set to `true` when `VoronoiHandler` is active.
     * Used to prevent collision with mouseEnter events.
     */
    isVoronoiEnabled?: boolean;
  };
}

export interface UseChartVoronoiParameters {
  /**
   * If true, the hit area interaction is disabled and falls back to hover events.
   */
  disableHitArea?: boolean;
  /**
   * Defines the maximum distance between a scatter point and the pointer that triggers the interaction.
   * If set to `'item'`, the radius is the `markerSize`.
   * If `undefined`, the radius is assumed to be infinite.
   */
  hitAreaRadius?: 'item' | number | undefined;
  /**
   * Callback fired when clicking close to an item, or when it is activated with the Enter or Space keys.
   * This is only available for scatter plot for now.
   * Activation with the Enter and Space keys requires the `enableKeyboardClickEvents` experimental feature.
   * @param {MouseEvent} event The event that activated the item. It is a `KeyboardEvent` on Enter or Space activation. Import `@mui/x-charts/moduleAugmentation/keyboardItemActivation` for correct typing.
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick?: (event: ItemActivationEvent, scatterItemIdentifier: ScatterItemIdentifier) => void;
}

export type UseChartVoronoiDefaultizedParameters = Pick<
  UseChartVoronoiParameters,
  'hitAreaRadius' | 'disableHitArea' | 'onItemClick'
>;

export type UseChartClosestPointSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    instance: UseChartVoronoiInstance;
    state: UseChartVoronoiState;
    params: UseChartVoronoiParameters;
    defaultizedParams: UseChartVoronoiDefaultizedParameters;
    dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
    optionalDependencies: [
      UseChartInteractionSignature,
      UseChartHighlightSignature<SeriesType>,
      UseChartTooltipSignature,
      UseChartZAxisSignature,
    ];
  }>;
