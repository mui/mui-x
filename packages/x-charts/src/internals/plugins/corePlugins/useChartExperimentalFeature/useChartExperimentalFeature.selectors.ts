import { createSelector } from '@mui/x-internals/store';
import { type ChartRootSelector } from '../../utils/selectors';
import type { UseChartExperimentalFeaturesSignature } from './useChartExperimentalFeature.types';

export const selectorChartExperimentalFeaturesState: ChartRootSelector<
  UseChartExperimentalFeaturesSignature
> = (state) => state.experimentalFeatures;

export const selectorPreferStrictDomainInLineCharts = createSelector(
  selectorChartExperimentalFeaturesState,
  (features) => Boolean(features?.preferStrictDomainInLineCharts),
);
