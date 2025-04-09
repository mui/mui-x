import { ChartRootSelector, createSelector } from '../../utils/selectors';
import type { UseChartAnimationSignature } from './useChartAnimation.types';

const selectorChartAnimationState: ChartRootSelector<UseChartAnimationSignature> = (state) =>
  state.animation;

export const selectorChartSkipAnimation = createSelector(
  selectorChartAnimationState,
  (state) => state.skip || state.skipAnimationRequests.size > 0,
);
