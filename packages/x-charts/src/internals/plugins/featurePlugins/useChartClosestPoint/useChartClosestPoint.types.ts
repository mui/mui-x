import type { ScatterItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { type ChartPluginSignature } from '../../models';
import { type UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import { type UseChartHighlightSignature } from '../useChartHighlight';
import { type UseChartInteractionSignature } from '../useChartInteraction';
import { type UseChartTooltipSignature } from '../useChartTooltip';

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
   * If true, the closest point interaction is disabled.
   */
  disableClosestPoint?: boolean;
  /**
   * If true, the voronoi interaction are ignored.
   * @deprecated Use `disableClosestPoint` instead.
   */
  disableVoronoi?: boolean;
  /**
   * Defines the maximum distance between a scatter point and the pointer that triggers the interaction.
   * If set to `'item'`, the radius is the `markerSize`.
   * If `undefined`, the radius is assumed to be infinite.
   */
  interactionMaxRadius?: 'item' | number | undefined;
  /**
   * Defines the maximum distance between a scatter point and the pointer that triggers the interaction.
   * If set to `'item'`, the radius is the `markerSize`.
   * If `undefined`, the radius is assumed to be infinite.
   * @deprecated Use `interactionMaxRadius` instead.
   */
  voronoiMaxRadius?: 'item' | number | undefined;
  /**
   * Callback fired when clicking close to an item.
   * This is only available for scatter plot for now.
   * @param {MouseEvent} event Mouse event caught at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick?: (event: MouseEvent, scatterItemIdentifier: ScatterItemIdentifier) => void;
}

export type UseChartVoronoiDefaultizedParameters = Pick<
  UseChartVoronoiParameters,
  'interactionMaxRadius' | 'voronoiMaxRadius' | 'disableVoronoi' | 'onItemClick'
> & {
  /**
   * If true, the closest point interaction is disabled.
   */
  disableClosestPoint: boolean;
};

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
    ];
  }>;
