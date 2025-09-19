import { createSelector } from '@mui/x-charts/internals';
import { selectorChartZoomState } from './useChartProZoom.selectors';
import type { ZoomInteractionName, PanInteractionName } from './ZoomInteractionConfig.types';

export const selectorZoomInteractionConfig = createSelector(
  [selectorChartZoomState, (_state, interactionName: ZoomInteractionName) => interactionName],
  (zoomState, interactionName) => zoomState.zoomInteractionConfig.zoom[interactionName] ?? null,
);

export const selectorPanInteractionConfig = createSelector(
  [selectorChartZoomState, (_state, interactionName: PanInteractionName) => interactionName],
  (zoomState, interactionName) => zoomState.zoomInteractionConfig.pan[interactionName] ?? null,
);
