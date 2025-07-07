import { ChartPluginSignature } from '../../models';

export interface ChartExperimentalFeatures {
  /**
   * Default domainLimit to strict for line chart x-axis.
   */
  strictDomainLimit?: boolean;
}

export interface UseChartExperimentalFeaturesParameters {
  /**
   * Options to enable features planned for the nex major.
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
