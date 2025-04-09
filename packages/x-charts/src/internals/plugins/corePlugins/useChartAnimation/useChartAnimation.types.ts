import { ChartPluginSignature } from '../../models';
import type { UseChartCartesianAxisSignature } from '../../featurePlugins/useChartCartesianAxis';

export interface UseChartAnimationParameters {
  /**
   * If true, animations should be skipped.
   */
  skipAnimation?: boolean;
}

export type UseChartAnimationDefaultizedParameters = UseChartAnimationParameters & {
  skipAnimation: NonNullable<UseChartAnimationParameters['skipAnimation']>;
};

export interface UseChartAnimationState {
  animation: {
    /**
     * User-provided value. If true, animations should be skipped.
     */
    skip: boolean;
    /**
     * Holds temporary requests to skip animations.
     * If there is at least one request, animations are skipped.
     */
    skipAnimationRequests: Set<Symbol>;
  };
}

export interface UseChartAnimationInstance {
  /**
   * Function to request the chart to skip animations.
   * @returns {() => void} a function that removes the skip animation request.
   */
  disableAnimation: () => () => void;
}

export type UseChartAnimationSignature = ChartPluginSignature<{
  params: UseChartAnimationParameters;
  defaultizedParams: UseChartAnimationDefaultizedParameters;
  state: UseChartAnimationState;
  instance: UseChartAnimationInstance;
  optionalDependencies: [UseChartCartesianAxisSignature];
}>;
