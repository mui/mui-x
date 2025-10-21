import { ChartRootSelector, createChartSelector } from '../../utils/selectors';
import type { UseChartAnimationSignature } from './useChartAnimation.types';

const selectorChartAnimationState: ChartRootSelector<UseChartAnimationSignature> = (state) =>
  state.animation;

export const selectorChartSkipAnimation = createChartSelector(
  [selectorChartAnimationState],
  (state) => state.skip || state.skipAnimationRequests > 0,
);
