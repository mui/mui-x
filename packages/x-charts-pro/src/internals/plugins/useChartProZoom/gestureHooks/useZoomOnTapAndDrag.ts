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
import { type TapAndDragEvent } from '@mui/x-internal-gestures/core';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
import {
  getHorizontalCenterRatio,
  getVerticalCenterRatio,
  isSpanValid,
  zoomAtPoint,
} from './useZoom.utils';

export const useZoomOnTapAndDrag = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);
  const isZoomEnabled = Object.keys(optionsLookup).length > 0;

  // Zoom on pinch
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const rafThrottledCallback = rafThrottle((event: TapAndDragEvent) => {
      setZoomDataCallback((prev) => {
        return prev.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }

          const isZoomIn = event.detail.deltaY < 0;
          const scaleRatio = 1 + event.detail.deltaY / 100;

          // If the delta is 0, we didn't move
          if (event.detail.deltaY === 0) {
            return zoom;
          }

          const point = getSVGPoint(element, {
            clientX: event.detail.initialCentroid.x,
            clientY: event.detail.initialCentroid.y,
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

    const zoomHandler = instance.addInteractionListener('zoomTapAndDrag', rafThrottledCallback);

    return () => {
      zoomHandler.cleanup();
      rafThrottledCallback.clear();
    };
  }, [svgRef, drawingArea, isZoomEnabled, optionsLookup, store, instance, setZoomDataCallback]);
};
