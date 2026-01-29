'use client';
import * as React from 'react';
import {
  type ChartPlugin,
  type ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';
import { selectorZoomInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const useZoomOnDoubleTapReset = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const { svgRef } = instance;
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorZoomInteractionConfig, 'doubleTapReset' as const);

  const isZoomOnDoubleTapResetEnabled: boolean =
    Object.keys(optionsLookup).length > 0 && Boolean(config);

  React.useEffect(() => {
    if (!isZoomOnDoubleTapResetEnabled) {
      return;
    }

    instance.updateZoomInteractionListeners('zoomDoubleTapReset', {
      requiredKeys: config!.requiredKeys,
      pointerMode: config!.pointerMode,
      pointerOptions: {
        mouse: config!.mouse,
        touch: config!.touch,
      },
    });
  }, [config, isZoomOnDoubleTapResetEnabled, instance]);

  // Reset zoom on double tap
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomOnDoubleTapResetEnabled) {
      return () => {};
    }

    const handleDoubleTapReset = () => {
      // Reset all axes to their default zoom state
      setZoomDataCallback((prev) => {
        return prev.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }

          // Reset to the full range (minStart to maxEnd)
          return {
            axisId: zoom.axisId,
            start: option.minStart,
            end: option.maxEnd,
          };
        });
      });
    };

    const doubleTapResetHandler = instance.addInteractionListener(
      'zoomDoubleTapReset',
      handleDoubleTapReset,
    );

    return () => {
      doubleTapResetHandler.cleanup();
    };
  }, [svgRef, isZoomOnDoubleTapResetEnabled, optionsLookup, instance, setZoomDataCallback, store]);
};
