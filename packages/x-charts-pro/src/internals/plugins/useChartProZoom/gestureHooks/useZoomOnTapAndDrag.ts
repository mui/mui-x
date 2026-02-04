'use client';
import * as React from 'react';
import {
  type ChartPlugin,
  getSVGPoint,
  selectorChartDrawingArea,
  type ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { type TapAndDragEvent } from '@mui/x-internal-gestures/core';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';
import {
  getHorizontalCenterRatio,
  getVerticalCenterRatio,
  isSpanValid,
  zoomAtPoint,
} from './useZoom.utils';
import { selectorZoomInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const useZoomOnTapAndDrag = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const { svgRef } = instance;
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorZoomInteractionConfig, 'tapAndDrag' as const);

  const isZoomOnTapAndDragEnabled: boolean =
    Object.keys(optionsLookup).length > 0 && Boolean(config);

  React.useEffect(() => {
    if (!isZoomOnTapAndDragEnabled) {
      return;
    }

    instance.updateZoomInteractionListeners('zoomTapAndDrag', {
      requiredKeys: config!.requiredKeys,
      pointerMode: config!.pointerMode,
      pointerOptions: {
        mouse: config!.mouse,
        touch: config!.touch,
      },
    });
  }, [config, isZoomOnTapAndDragEnabled, instance]);

  // Zoom on tap and drag
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomOnTapAndDragEnabled) {
      return () => {};
    }

    const rafThrottledCallback = rafThrottle((event: TapAndDragEvent) => {
      // If the delta is 0, we didn't move
      if (event.detail.deltaY === 0) {
        return;
      }

      setZoomDataCallback((prev) => {
        return prev.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }

          const isZoomIn = event.detail.deltaY > 0;
          const scaleRatio = 1 + event.detail.deltaY / 100;

          const point = getSVGPoint(element, {
            clientX: event.detail.initialCentroid.x,
            clientY: event.detail.initialCentroid.y,
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

    const zoomHandler = instance.addInteractionListener('zoomTapAndDrag', rafThrottledCallback);

    return () => {
      zoomHandler.cleanup();
      rafThrottledCallback.clear();
    };
  }, [
    svgRef,
    drawingArea,
    isZoomOnTapAndDragEnabled,
    optionsLookup,
    store,
    instance,
    setZoomDataCallback,
  ]);
};
