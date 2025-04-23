'use client';
import * as React from 'react';
import {
  ChartPlugin,
  useSelector,
  selectorChartDrawingArea,
  ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { PanEvent } from '@web-gestures/core';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
import { translateZoom } from './useZoom.utils';

export const usePanOnDrag = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);

  // Add event for chart panning
  const isPanEnabled = React.useMemo(
    () => Object.values(optionsLookup).some((v) => v.panning) || false,
    [optionsLookup],
  );

  React.useEffect(() => {
    const element = svgRef.current;

    if (element === null || !isPanEnabled) {
      return () => {};
    }

    // Store the initial zoom data in the event detail
    // This way we can simplify the logic by using the deltas for full calculation
    // instead of always calculating the new zoom data based on the current zoom data
    const panStartHandler = instance.addInteractionListener('panStart', (event) => {
      event.detail.customData.zoomData = store.getSnapshot().zoom.zoomData;
    });

    const rafThrottledCallback = rafThrottle((event: PanEvent) => {
      const newZoomData = translateZoom(
        event.detail.customData.zoomData,
        { x: event.detail.deltaX, y: -event.detail.deltaY },
        {
          width: drawingArea.width,
          height: drawingArea.height,
        },
        optionsLookup,
      );

      setZoomDataCallback(newZoomData);
    });

    const panHandler = instance.addInteractionListener<{ zoomData: readonly ZoomData[] }>(
      'pan',
      rafThrottledCallback,
    );

    return () => {
      panStartHandler.cleanup();
      panHandler.cleanup();
      rafThrottledCallback.clear();
    };
  }, [
    instance,
    svgRef,
    isPanEnabled,
    optionsLookup,
    drawingArea.width,
    drawingArea.height,
    setZoomDataCallback,
    store,
  ]);
};
