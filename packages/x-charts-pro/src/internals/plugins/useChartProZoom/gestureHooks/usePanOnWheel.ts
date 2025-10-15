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

  const isPanOnWheelEnabled = React.useMemo(
    () => (Object.keys(optionsLookup).length > 0 && config) || false,
    [optionsLookup, config],
  );

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

      const axesFilter = config?.axesFilter ?? 'x';

      rafThrottledSetZoomData((prev) => {
        // Get the wheel delta
        const wheelEvent = event.detail.srcEvent;

        // Determine pan direction and amount based on axes filter
        let movementX = 0;
        let movementY = 0;

        if (axesFilter === 'x' || axesFilter === 'xy') {
          // Pan horizontally when scrolling
          movementX = -wheelEvent.deltaY;
        }

        if (axesFilter === 'y' || axesFilter === 'xy') {
          // Pan vertically when scrolling
          movementY = wheelEvent.deltaY;
        }

        // Filter the zoom data based on the axes filter
        const filteredPrev = prev.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }

          // Apply axis filter
          if (axesFilter === 'x' && option.axisDirection !== 'x') {
            return zoom;
          }
          if (axesFilter === 'y' && option.axisDirection !== 'y') {
            return zoom;
          }
          // 'xy' applies to all axes

          return zoom;
        });

        return translateZoom(
          filteredPrev,
          { x: movementX, y: movementY },
          drawingArea,
          optionsLookup,
        ).map((newZoom) => {
          // Find the original zoom data for axes that weren't affected by the filter
          const originalZoom = prev.find((z) => z.axisId === newZoom.axisId);
          const option = optionsLookup[newZoom.axisId];

          if (!option) {
            return originalZoom!;
          }

          // Return the new zoom only if it was supposed to be affected
          if (axesFilter === 'x' && option.axisDirection !== 'x') {
            return originalZoom!;
          }
          if (axesFilter === 'y' && option.axisDirection !== 'y') {
            return originalZoom!;
          }

          return newZoom;
        });
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
