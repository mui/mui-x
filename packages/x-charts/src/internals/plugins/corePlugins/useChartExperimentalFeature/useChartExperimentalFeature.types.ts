import { type ChartPluginSignature } from '../../models';

export interface ChartExperimentalFeatures {}

export interface UseChartExperimentalFeaturesParameters {
  /**
   * Options to enable features planned for the next major.
   */
  experimentalFeatures?: ChartExperimentalFeatures;
}

export interface UseChartExperimentalFeaturesState {
  experimentalFeatures?: ChartExperimentalFeatures;
}

export type UseChartExperimentalFeaturesSignature = ChartPluginSignature<{
  params: UseChartExperimentalFeaturesParameters;
  defaultizedParams: UseChartExperimentalFeaturesParameters;
  state: UseChartExperimentalFeaturesState;
}>;
