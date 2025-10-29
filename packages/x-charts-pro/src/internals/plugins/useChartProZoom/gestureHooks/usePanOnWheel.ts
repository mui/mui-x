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
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
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
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);
  const startedOutsideRef = React.useRef(false);
  const startedOutsideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = useSelector(store, selectorPanInteractionConfig, ['wheel' as const]);

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

      rafThrottledSetZoomData((prev) => {
        const wheelEvent = event.detail;

        let movementX = 0;
        let movementY = 0;

        if (allowedDirection === 'x' || allowedDirection === 'xy') {
          movementX = wheelEvent.deltaX;
        }

        if (allowedDirection === 'y' || allowedDirection === 'xy') {
          movementY = wheelEvent.deltaY;
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
