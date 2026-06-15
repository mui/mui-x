'use client';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseChartProBarSubsamplingSignature } from './useChartProBarSubsampling.types';

/**
 * Activates bar subsampling. The level-of-detail pyramids and the active-level selection live in
 * community selectors (`selectorChartBarSubsamplingPyramids`); this plugin only flips the feature
 * on so those selectors start producing data for the bar plot.
 *
 * Demos: none yet — internal performance feature.
 */
export const useChartProBarSubsampling: ChartPlugin<UseChartProBarSubsamplingSignature> = () => {
  return {};
};

useChartProBarSubsampling.params = {};

useChartProBarSubsampling.getInitialState = () => ({
  barSubsampling: {
    enabled: true,
    strategy: 'minMaxEnvelope',
  },
});
