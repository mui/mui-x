import { createSelector } from '@mui/x-internals/store';
import { type ChartRootSelector, type ChartOptionalRootSelector } from '@mui/x-charts/internals';
import { type UseChartWebGLSignature } from './useChartWebGL.types';

export const selectorWebGLState: ChartRootSelector<UseChartWebGLSignature> = (state) => state.webGL;

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
export const selectorWebGLStateOptional: ChartOptionalRootSelector<UseChartWebGLSignature> = (
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
