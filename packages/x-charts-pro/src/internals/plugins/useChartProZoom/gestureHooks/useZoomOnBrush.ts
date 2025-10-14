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
import { PanEvent } from '@mui/x-internal-gestures/core';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
import { getHorizontalCenterRatio, getVerticalCenterRatio, isSpanValid } from './useZoom.utils';
import { selectorZoomInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const useZoomOnBrush = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);
  const config = useSelector(store, selectorZoomInteractionConfig, ['brush' as const]);
  const brushStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const isZoomOnBrushEnabled = React.useMemo(
    () => (Object.keys(optionsLookup).length > 0 && config) || false,
    [optionsLookup, config],
  );

  React.useEffect(() => {
    if (!isZoomOnBrushEnabled) {
      return;
    }

    instance.updateZoomInteractionListeners('brush', {
      requiredKeys: config!.requiredKeys,
      pointerMode: config!.pointerMode,
      pointerOptions: {
        mouse: config!.mouse,
        touch: config!.touch,
      },
    });
  }, [config, isZoomOnBrushEnabled, instance]);

  // Zoom on brush
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomOnBrushEnabled) {
      return () => {};
    }

    const handleBrushStart = (event: PanEvent) => {
      const point = getSVGPoint(element, {
        clientX: event.detail.initialCentroid.x,
        clientY: event.detail.initialCentroid.y,
      });

      if ((event.detail.target as SVGElement)?.closest('[data-charts-zoom-slider]')) {
        return;
      }

      brushStartRef.current = point;
      store.update((prevState) => ({
        ...prevState,
        zoom: { ...prevState.zoom, isInteracting: true },
        brush: { start: point, current: point },
      }));
    };

    const handleBrushCancel = () => {
      brushStartRef.current = null;
      store.update((prevState) => ({
        ...prevState,
        brush: { start: null, current: null },
      }));
    };

    const handleBrush = (event: PanEvent) => {
      // Update current brush position for visual feedback
      if (!brushStartRef.current) {
        return;
      }

      const currentPoint = getSVGPoint(element, {
        clientX: event.detail.centroid.x,
        clientY: event.detail.centroid.y,
      });

      store.update((prevState) => ({
        ...prevState,
        brush: {
          start: brushStartRef.current,
          current: currentPoint,
        },
      }));
    };

    const handleBrushEnd = (event: PanEvent) => {
      if (!brushStartRef.current) {
        return;
      }

      const startPoint = brushStartRef.current;
      const endPoint = getSVGPoint(element, {
        clientX: event.detail.centroid.x,
        clientY: event.detail.centroid.y,
      });

      // Calculate the brush rectangle
      const minX = Math.min(startPoint.x, endPoint.x);
      const maxX = Math.max(startPoint.x, endPoint.x);
      const minY = Math.min(startPoint.y, endPoint.y);
      const maxY = Math.max(startPoint.y, endPoint.y);

      // Convert the brush rectangle to zoom percentages for each axis
      setZoomDataCallback((prev) => {
        return prev.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }

          let startRatio: number;
          let endRatio: number;

          // Convert pixel coordinates to the drawing area
          if (option.axisDirection === 'x') {
            startRatio = getHorizontalCenterRatio({ x: minX, y: 0 }, drawingArea);
            endRatio = getHorizontalCenterRatio({ x: maxX, y: 0 }, drawingArea);
          } else {
            // For y-axis, we need to flip the coordinates
            startRatio = getVerticalCenterRatio({ x: 0, y: maxY }, drawingArea);
            endRatio = getVerticalCenterRatio({ x: 0, y: minY }, drawingArea);
          }

          // Clamp ratios to [0, 1]
          startRatio = Math.max(0, Math.min(1, startRatio));
          endRatio = Math.max(0, Math.min(1, endRatio));

          // Calculate the new zoom range based on the current zoom state
          // This is important: we need to map the brush selection ratios to the current zoom range
          const currentStart = zoom.start;
          const currentEnd = zoom.end;
          const currentSpan = currentEnd - currentStart;

          const newStart = currentStart + startRatio * currentSpan;
          const newEnd = currentStart + endRatio * currentSpan;

          const clampedStart = Math.max(option.minStart, Math.min(option.maxEnd, newStart));
          const clampedEnd = Math.max(option.minStart, Math.min(option.maxEnd, newEnd));

          if (!isSpanValid(clampedStart, clampedEnd, true, option)) {
            return zoom;
          }

          return {
            axisId: zoom.axisId,
            start: clampedStart,
            end: clampedEnd,
          };
        });
      });

      brushStartRef.current = null;

      // Clear brush visual state
      store.update((prevState) => ({
        ...prevState,
        brush: { start: null, current: null },
      }));
    };

    const brushStartHandler = instance.addInteractionListener('zoomBrushStart', handleBrushStart);
    const brushHandler = instance.addInteractionListener('brush', handleBrush);
    const brushCancelHandler = instance.addInteractionListener(
      'zoomBrushCancel',
      handleBrushCancel,
    );
    const brushEndHandler = instance.addInteractionListener('zoomBrushEnd', handleBrushEnd);

    return () => {
      brushStartHandler.cleanup();
      brushHandler.cleanup();
      brushEndHandler.cleanup();
      brushCancelHandler.cleanup();
      brushStartRef.current = null;
    };
  }, [
    svgRef,
    drawingArea,
    isZoomOnBrushEnabled,
    optionsLookup,
    instance,
    setZoomDataCallback,
    store,
  ]);
};
