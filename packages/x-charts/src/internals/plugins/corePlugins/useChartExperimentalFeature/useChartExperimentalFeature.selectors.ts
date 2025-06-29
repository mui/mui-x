import { ChartRootSelector, createSelector } from '../../utils/selectors';
import type { UseChartExperimentalFeaturesSignature } from './useChartExperimentalFeature.types';

export const selectorChartExperimentalFeaturesState: ChartRootSelector<
  UseChartExperimentalFeaturesSignature
> = (state) => state.experimentalFeatures;

export const selectorUseStrictDomainLimit = createSelector(
  [selectorChartExperimentalFeaturesState],
  (features) => Boolean(features?.strictDomainLimit),
);
