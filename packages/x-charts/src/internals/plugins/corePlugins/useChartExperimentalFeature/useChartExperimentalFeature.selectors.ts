import type { ChartSeriesType } from '../../../../models/seriesType/config';
import { type ChartState } from '../../models/chart';
import type {
  ChartExperimentalFeatures,
  UseChartExperimentalFeaturesSignature,
} from './useChartExperimentalFeature.types';

/**
 * Reads the value of a single experimental feature flag from the store.
 *
 * @example
 * const enabled = store.use(
 *   selectorChartExperimentalFeaturesState,
 *   'useNewDefaultTickSpacing',
 * );
 */
export const selectorChartExperimentalFeaturesState = <K extends keyof ChartExperimentalFeatures>(
  state: ChartState<[UseChartExperimentalFeaturesSignature<ChartSeriesType>]>,
  featureName: K,
): ChartExperimentalFeatures[K] | undefined => state.experimentalFeatures?.[featureName];
