import type { ChartSeriesType, ScatterItemIdentifier } from '../../../../models/seriesType';
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
   * If true, the voronoi interaction are ignored.
   */
  disableVoronoi?: boolean;
  /**
   * Defines the maximum distance between a scatter point and the pointer that triggers the interaction.
   * If set to `'item'`, the radius is the `markerSize`.
   * If `undefined`, the radius is assumed to be infinite.
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
  'voronoiMaxRadius' | 'onItemClick'
> & {
  /**
   * If true, the voronoi plugin is disabled.
   */
  disableVoronoi: boolean;
};

export type UseChartClosestPointSignature<SeriesType extends ChartSeriesType = ChartSeriesType> = ChartPluginSignature<{
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
