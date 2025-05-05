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
import {
  getHorizontalCenterRatio,
  getVerticalCenterRatio,
  getWheelScaleRatio,
  isSpanValid,
  zoomAtPoint,
} from './useZoom.utils';

export const useZoomOnWheel = (
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
  const startedOutsideRef = React.useRef(false);
  const startedOutsideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add event for chart zoom in/out
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomEnabled) {
      return () => {};
    }

    const rafThrottledSetZoomData = rafThrottle(setZoomDataCallback);

    const zoomOnWheelHandler = instance.addInteractionListener('turnWheel', (event) => {
      const point = getSVGPoint(element, event.detail.srcEvent);

      // This prevents a zoom event from being triggered when the mouse is outside the chart area.
      // The timeout is used to prevent an weird behavior where if the mouse is outside but enters due to
      // scrolling, then the zoom event is triggered.
      if (!instance.isPointInside(point) || startedOutsideRef.current) {
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

      const zoomData = store.getSnapshot().zoom.zoomData;

      const newZoomData = zoomData.map((zoom) => {
        const option = optionsLookup[zoom.axisId];
        if (!option) {
          return zoom;
        }
        const centerRatio =
          option.axisDirection === 'x'
            ? getHorizontalCenterRatio(point, drawingArea)
            : getVerticalCenterRatio(point, drawingArea);

        const { scaleRatio, isZoomIn } = getWheelScaleRatio(event.detail.srcEvent, option.step);
        const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

        if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
          return zoom;
        }

        return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
      });

      event.detail.srcEvent.preventDefault();

      rafThrottledSetZoomData(newZoomData);
    });

    return () => {
      zoomOnWheelHandler.cleanup();
      if (startedOutsideTimeoutRef.current) {
        clearTimeout(startedOutsideTimeoutRef.current);
        startedOutsideTimeoutRef.current = null;
      }
      startedOutsideRef.current = false;
      rafThrottledSetZoomData.clear();
    };
  }, [svgRef, drawingArea, isZoomEnabled, optionsLookup, instance, setZoomDataCallback, store]);
};
