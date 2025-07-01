import { createSelector } from '@mui/x-charts/internals';
import { selectorChartZoomState } from './useChartProZoom.selectors';
import type { InteractionName } from './ZoomConfig.types';

export const selectorZoomConfig = createSelector(
  [selectorChartZoomState, (_state, interactionName: InteractionName) => interactionName],
  (zoomState, interactionName) => zoomState.zoomConfig.zoom[interactionName] || null,
);

export const selectorPanConfig = createSelector(
  [selectorChartZoomState, (_state, interactionName: InteractionName) => interactionName],
  (zoomState, interactionName) => zoomState.zoomConfig.pan[interactionName] || null,
);
