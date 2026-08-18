'use client';
import { selectorChartDrawingArea, selectorChartZoomOptionsLookup } from '@mui/x-charts/internals';
import type { ChartPlugin, ZoomData } from '@mui/x-charts/internals';
import type { UseChartProZoomSignature } from '../useChartProZoom.types';
import { translateZoom } from './useZoom.utils';
import { selectorPanInteractionConfig } from '../ZoomInteractionConfig.selectors';
import { useKeyboardGesture } from '../../zoomGestures/useKeyboardGesture';
import { KEYBOARD_PAN_STEP, getPanKeyDirection } from './keyboardInteraction';

export const usePanOnKeyboard = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorPanInteractionConfig, 'keyboard' as const);

  const isPanOnKeyboardEnabled: boolean =
    Object.values(optionsLookup).some((v) => v.panning) && Boolean(config);

  useKeyboardGesture(instance, {
    enabled: isPanOnKeyboardEnabled,
    onKeyDown: (event) => {
      const direction = getPanKeyDirection(event);

      if (direction === null) {
        return;
      }

      event.preventDefault();

      // `translateZoom` moves the data, while the arrow keys move the view, hence the opposite sign.
      const movement = {
        x: -direction.x * KEYBOARD_PAN_STEP * drawingArea.width,
        y: -direction.y * KEYBOARD_PAN_STEP * drawingArea.height,
      };

      setZoomDataCallback((prev) =>
        translateZoom(prev, movement, drawingArea, optionsLookup, direction.x === 0 ? 'y' : 'x'),
      );

      instance.announceZoomChange?.();
    },
  });
};
