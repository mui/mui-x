'use client';
import * as React from 'react';
import {
  type ChartPlugin,
  getSVGPoint,
  selectorChartDrawingArea,
  type ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';
import { translateZoom } from './useZoom.utils';
import { selectorPanInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const usePanOnWheel = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const startedOutsideRef = React.useRef(false);
  const startedOutsideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = store.use(selectorPanInteractionConfig, 'wheel' as const);

  const isPanOnWheelEnabled: boolean = Object.keys(optionsLookup).length > 0 && Boolean(config);

  React.useEffect(() => {
    if (!isPanOnWheelEnabled) {
      return;
    }

    instance.updateZoomInteractionListeners('panTurnWheel', {
      requiredKeys: config!.requiredKeys,
    });
  }, [config, isPanOnWheelEnabled, instance]);

  // Add event for chart pan on wheel
  React.useEffect(() => {
    const element = svgRef.current;
    const accumulatedChange = { x: 0, y: 0 };
    if (element === null || !isPanOnWheelEnabled) {
      return () => {};
    }

    const rafThrottledSetZoomData = rafThrottle(setZoomDataCallback);

    const wheelHandler = instance.addInteractionListener('panTurnWheel', (event) => {
      const point = getSVGPoint(element, {
        clientX: event.detail.centroid.x,
        clientY: event.detail.centroid.y,
      });

      // This prevents a pan event from being triggered when the mouse is outside the chart area.
      // The timeout is used to prevent an weird behavior where if the mouse is outside but enters due to
      // scrolling, then the pan event is triggered.
      if (startedOutsideRef.current || !instance.isPointInside(point.x, point.y)) {
        startedOutsideRef.current = true;
        if (startedOutsideTimeoutRef.current) {
          clearTimeout(startedOutsideTimeoutRef.current);
        }
        startedOutsideTimeoutRef.current = setTimeout(() => {
          startedOutsideRef.current = false;
          startedOutsideTimeoutRef.current = null;
        }, 100);
        return;
      }

      event.detail.srcEvent.preventDefault();

      const allowedDirection = config?.allowedDirection ?? 'x';

      if (event.detail.deltaX === 0 && event.detail.deltaY === 0) {
        return;
      }

      accumulatedChange.x += event.detail.deltaX;
      accumulatedChange.y += event.detail.deltaY;

      rafThrottledSetZoomData((prev) => {
        const x = accumulatedChange.x;
        const y = accumulatedChange.y;
        accumulatedChange.x = 0;
        accumulatedChange.y = 0;

        let movementX = 0;
        let movementY = 0;

        if (allowedDirection === 'x' || allowedDirection === 'xy') {
          movementX = -x;
        }

        if (allowedDirection === 'y' || allowedDirection === 'xy') {
          movementY = y;
        }

        if (movementX === 0 && movementY === 0) {
          return prev;
        }

        return translateZoom(
          prev,
          { x: movementX, y: movementY },
          drawingArea,
          optionsLookup,
          allowedDirection,
        );
      });
    });

    return () => {
      wheelHandler.cleanup();
      if (startedOutsideTimeoutRef.current) {
        clearTimeout(startedOutsideTimeoutRef.current);
        startedOutsideTimeoutRef.current = null;
      }
      startedOutsideRef.current = false;
      rafThrottledSetZoomData.clear();
    };
  }, [
    svgRef,
    drawingArea,
    isPanOnWheelEnabled,
    optionsLookup,
    instance,
    setZoomDataCallback,
    store,
    config,
  ]);
};
