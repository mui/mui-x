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
import { PanEvent } from '@mui/x-internal-gestures/core';
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
  const startRef = React.useRef<readonly ZoomData[]>(null);

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

    const handlePanStart = (event: PanEvent) => {
      if (!(event.detail.target as SVGElement)?.closest('[data-charts-zoom-slider]')) {
        startRef.current = store.value.zoom.zoomData;
      }
    };
    const handlePanEnd = () => {
      startRef.current = null;
    };

    const throttledCallback = rafThrottle((event: PanEvent, zoomData: readonly ZoomData[]) => {
      const newZoomData = translateZoom(
        zoomData,
        { x: event.detail.activeDeltaX, y: -event.detail.activeDeltaY },
        {
          width: drawingArea.width,
          height: drawingArea.height,
        },
        optionsLookup,
      );

      setZoomDataCallback(newZoomData);
    });

    const handlePan = (event: PanEvent) => {
      const zoomData = startRef.current;
      if (!zoomData) {
        return;
      }
      throttledCallback(event, zoomData);
    };

    const panHandler = instance.addInteractionListener('pan', handlePan);
    const panStartHandler = instance.addInteractionListener('panStart', handlePanStart);
    const panEndHandler = instance.addInteractionListener('panEnd', handlePanEnd);

    return () => {
      panStartHandler.cleanup();
      panHandler.cleanup();
      panEndHandler.cleanup();
      throttledCallback.clear();
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
    startRef,
  ]);
};
