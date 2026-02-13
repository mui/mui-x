'use client';
import * as React from 'react';
import {
  type ChartPlugin,
  getSurfacePoint,
  selectorChartDrawingArea,
  type ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { type PinchEvent } from '@mui/x-internal-gestures/core';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';
import {
  getHorizontalCenterRatio,
  getVerticalCenterRatio,
  isSpanValid,
  zoomAtPoint,
} from './useZoom.utils';
import { selectorZoomInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const useZoomOnPinch = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const { svgRef } = instance;
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorZoomInteractionConfig, 'pinch' as const);

  const isZoomOnPinchEnabled: boolean = Object.keys(optionsLookup).length > 0 && Boolean(config);

  React.useEffect(() => {
    if (!isZoomOnPinchEnabled) {
      return;
    }

    instance.updateZoomInteractionListeners('zoomPinch', {
      requiredKeys: config!.requiredKeys,
    });
  }, [config, isZoomOnPinchEnabled, instance]);

  // Zoom on pinch
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomOnPinchEnabled) {
      return () => {};
    }

    const rafThrottledCallback = rafThrottle((event: PinchEvent) => {
      // If the delta is 0, it means the pinch gesture is not valid.
      if (event.detail.direction === 0) {
        return;
      }

      setZoomDataCallback((prev) => {
        return prev.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }

          const isZoomIn = event.detail.direction > 0;
          const scaleRatio = 1 + event.detail.deltaScale;

          const point = getSurfacePoint(element, {
            clientX: event.detail.centroid.x,
            clientY: event.detail.centroid.y,
          });

          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea, option.reverse)
              : getVerticalCenterRatio(point, drawingArea, option.reverse);

          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return zoom;
          }
          return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
        });
      });
    });

    const zoomHandler = instance.addInteractionListener('zoomPinch', rafThrottledCallback);

    return () => {
      zoomHandler.cleanup();
      rafThrottledCallback.clear();
    };
  }, [
    svgRef,
    drawingArea,
    isZoomOnPinchEnabled,
    optionsLookup,
    store,
    instance,
    setZoomDataCallback,
  ]);
};
