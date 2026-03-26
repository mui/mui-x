import type { ChartSeriesType } from '../../../../models/seriesType/config';
import { type ChartRootSelector } from '../../utils/selectors';
import type { UseChartExperimentalFeaturesSignature } from './useChartExperimentalFeature.types';

export const selectorChartExperimentalFeaturesState: ChartRootSelector<
  UseChartExperimentalFeaturesSignature<ChartSeriesType>
> = (state) => state.experimentalFeatures;
