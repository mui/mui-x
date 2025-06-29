'use client';
import * as React from 'react';
import {
  ChartPlugin,
  useSelector,
  getSVGPoint,
  selectorChartDrawingArea,
  ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { PinchEvent } from '@mui/x-internal-gestures/core';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
import {
  getHorizontalCenterRatio,
  getVerticalCenterRatio,
  isSpanValid,
  zoomAtPoint,
} from './useZoom.utils';
import { isGestureEnabledForPointer } from '../isGestureEnabledForPointer';

export const useZoomOnPinch = (
  {
    store,
    instance,
    svgRef,
    params,
  }: Pick<
    Parameters<ChartPlugin<UseChartProZoomSignature>>[0],
    'store' | 'instance' | 'svgRef' | 'params'
  >,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);
  const isZoomEnabled = Object.keys(optionsLookup).length > 0;

  // Zoom on pinch
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomEnabled || !params.zoomConfig.zoom.onPinch) {
      return () => {};
    }

    const rafThrottledCallback = rafThrottle((event: PinchEvent) => {
      if (
        !isGestureEnabledForPointer(event.detail.srcEvent, params.zoomConfig.zoom.onPinch!.mode)
      ) {
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

          // If the delta is 0, it means the pinch gesture is not valid.
          if (event.detail.direction === 0) {
            return zoom;
          }

          const point = getSVGPoint(element, {
            clientX: event.detail.centroid.x,
            clientY: event.detail.centroid.y,
          });

          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea)
              : getVerticalCenterRatio(point, drawingArea);

          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return zoom;
          }
          return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
        });
      });
    });

    const zoomHandler = instance.addInteractionListener('pinch', rafThrottledCallback);

    return () => {
      zoomHandler.cleanup();
      rafThrottledCallback.clear();
    };
  }, [svgRef, drawingArea, isZoomEnabled, optionsLookup, store, instance, setZoomDataCallback]);
};
