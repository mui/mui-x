'use client';
import { selectorChartZoomOptionsLookup } from '@mui/x-charts/internals';
import type { ChartPlugin, ZoomData } from '@mui/x-charts/internals';
import type { UseChartProZoomSignature } from '../useChartProZoom.types';
import { calculateZoom } from '../calculateZoom';
import { selectorZoomInteractionConfig } from '../ZoomInteractionConfig.selectors';
import { useKeyboardGesture } from '../../zoomGestures/useKeyboardGesture';
import { KEYBOARD_ZOOM_STEP, getZoomKeyAction } from './keyboardInteraction';

export const useZoomOnKeyboard = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorZoomInteractionConfig, 'keyboard' as const);

  const isZoomOnKeyboardEnabled: boolean = Object.keys(optionsLookup).length > 0 && Boolean(config);

  useKeyboardGesture(instance, {
    enabled: isZoomOnKeyboardEnabled,
    onKeyDown: (event) => {
      const action = getZoomKeyAction(event);

      if (action === null) {
        return;
      }

      event.preventDefault();

      setZoomDataCallback((prev) =>
        prev.map((zoom) => {
          const options = optionsLookup[zoom.axisId];

          if (!options) {
            return zoom;
          }

          if (action === 'reset') {
            return { axisId: zoom.axisId, start: options.minStart, end: options.maxEnd };
          }

          return calculateZoom(
            zoom,
            action === 'in' ? KEYBOARD_ZOOM_STEP : -KEYBOARD_ZOOM_STEP,
            options,
          );
        }),
      );

      instance.announceZoomChange?.();
    },
  });
};
