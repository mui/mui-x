'use client';
import * as React from 'react';
import {
  ChartPlugin,
  useSelector,
  ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
import { selectorZoomInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const useZoomOnDoubleTapReset = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);
  const config = useSelector(store, selectorZoomInteractionConfig, ['doubleTapReset' as const]);

  const isZoomOnDoubleTapResetEnabled = React.useMemo(
    () => (Object.keys(optionsLookup).length > 0 && config) || false,
    [optionsLookup, config],
  );

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
