import { createChartSelector } from '@mui/x-charts/internals';
import { selectorChartZoomState } from './useChartProZoom.selectors';
import type { ZoomInteractionName, PanInteractionName } from './ZoomInteractionConfig.types';

export const selectorZoomInteractionConfig = createChartSelector(
  [selectorChartZoomState],
  (zoomState, interactionName: ZoomInteractionName) =>
    zoomState.zoomInteractionConfig.zoom[interactionName] ?? null,
);

export const selectorPanInteractionConfig = createChartSelector(
  [selectorChartZoomState],
  (zoomState, interactionName: PanInteractionName) =>
    zoomState.zoomInteractionConfig.pan[interactionName] ?? null,
);
