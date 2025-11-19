import { createSelector } from '@mui/x-internals/store';
import { selectorChartZoomOptionsLookup } from '@mui/x-charts/internals';
import { selectorChartZoomState } from './useChartProZoom.selectors';
import type { ZoomInteractionName, PanInteractionName } from './ZoomInteractionConfig.types';

export const selectorZoomInteractionConfig = createSelector(
  selectorChartZoomState,
  (zoomState, interactionName: ZoomInteractionName) =>
    zoomState.zoomInteractionConfig.zoom[interactionName] ?? null,
);

export const selectorPanInteractionConfig = createSelector(
  selectorChartZoomState,
  (zoomState, interactionName: PanInteractionName) =>
    zoomState.zoomInteractionConfig.pan[interactionName] ?? null,
);

export const selectorIsZoomBrushEnabled = createSelector(
  selectorChartZoomOptionsLookup,
  (state) => selectorZoomInteractionConfig(state, 'brush'),
  (zoomOptions, zoomInteractionConfig) =>
    (Object.keys(zoomOptions).length > 0 && zoomInteractionConfig) || false,
);
