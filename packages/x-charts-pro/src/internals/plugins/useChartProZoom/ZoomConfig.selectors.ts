import { createSelector } from '@mui/x-charts/internals';
import { selectorChartZoomState } from './useChartProZoom.selectors';
import type { ZoomInteractionName, PanInteractionName } from './ZoomConfig.types';

export const selectorZoomConfig = createSelector(
  [selectorChartZoomState, (_state, interactionName: ZoomInteractionName) => interactionName],
  (zoomState, interactionName) => zoomState.zoomConfig.zoom[interactionName] || null,
);

export const selectorPanConfig = createSelector(
  [selectorChartZoomState, (_state, interactionName: PanInteractionName) => interactionName],
  (zoomState, interactionName) => zoomState.zoomConfig.pan[interactionName] || null,
);
