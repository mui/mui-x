import { ScatterItemIdentifier } from '../../../../models/seriesType';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { ChartPluginSignature } from '../../models';
import { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';
import { UseChartHighlightSignature } from '../useChartHighlight';
import { UseChartInteractionSignature } from '../useChartInteraction';

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
   * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius?: number | undefined;
  /**
   * Callback fired when clicking close to an item.
   * This is only available for scatter plot for now.
   * @param {MouseEvent} event Mouse event caught at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick?: (event: MouseEvent, scatterItemIdentifier: ScatterItemIdentifier) => void;
}

export type UseChartVoronoiDefaultizedParameters = UseChartVoronoiParameters & {
  disableVoronoi: boolean;
};

export type UseChartVoronoiSignature = ChartPluginSignature<{
  instance: UseChartVoronoiInstance;
  state: UseChartVoronoiState;
  params: UseChartVoronoiParameters;
  defaultizedParams: UseChartVoronoiDefaultizedParameters;
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
  optionalDependencies: [UseChartInteractionSignature, UseChartHighlightSignature];
}>;
