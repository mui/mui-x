import { type ChartRootSelector } from '../../utils/selectors';
import type { UseChartExperimentalFeaturesSignature } from './useChartExperimentalFeature.types';

export const selectorChartExperimentalFeaturesState: ChartRootSelector<
  UseChartExperimentalFeaturesSignature
> = (state) => state.experimentalFeatures;
