import { createSelector } from '@mui/x-internals/store';
import { type ChartRootSelector, type ChartOptionalRootSelector } from '@mui/x-charts/internals';
import { type UseChartPremiumWebGLSignature } from './useChartPremiumWebGL.types';

export const selectorWebGLState: ChartRootSelector<UseChartPremiumWebGLSignature> = (state) =>
  state.webGL;

export const selectorWebGLRenderTick = createSelector(
  selectorWebGLState,
  (webGL) => webGL.renderTick,
);

export const selectorWebGLIsContextReady = createSelector(
  selectorWebGLState,
  (webGL) => webGL.isContextReady,
);

/**
 * Optional selector that returns undefined if the WebGL plugin is not loaded.
 * Safe to use from components that may or may not have the plugin available.
 */
export const selectorWebGLStateOptional: ChartOptionalRootSelector<UseChartPremiumWebGLSignature> = (
  state,
) => state.webGL;

export const selectorWebGLRenderTickOptional = createSelector(
  selectorWebGLStateOptional,
  (webGL) => webGL?.renderTick,
);

export const selectorWebGLIsContextReadyOptional = createSelector(
  selectorWebGLStateOptional,
  (webGL) => webGL?.isContextReady ?? false,
);
