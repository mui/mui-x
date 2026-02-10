'use client';
import * as React from 'react';
import {
  type ChartPlugin,
  getSurfacePoint,
  selectorChartDrawingArea,
  type ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { type PanEvent } from '@mui/x-internal-gestures/core';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';
import { getHorizontalCenterRatio, getVerticalCenterRatio, isSpanValid } from './useZoom.utils';
import { selectorZoomInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const useZoomOnBrush = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance'>,
  setZoomDataCallback: React.Dispatch<(prev: ZoomData[]) => ZoomData[]>,
) => {
  const { svgRef } = instance;
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorZoomInteractionConfig, 'brush' as const);

  const isZoomOnBrushEnabled: boolean = Object.keys(optionsLookup).length > 0 && Boolean(config);

  React.useEffect(() => {
    instance.setZoomBrushEnabled(isZoomOnBrushEnabled);
  }, [isZoomOnBrushEnabled, instance]);

  // Zoom on brush
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomOnBrushEnabled) {
      return () => {};
    }

    const handleBrushEnd = (event: PanEvent) => {
      // Convert the brush rectangle to zoom percentages for each axis
      setZoomDataCallback((prev) => {
        const startPoint = getSurfacePoint(element, {
          clientX: event.detail.initialCentroid.x,
          clientY: event.detail.initialCentroid.y,
        });
        const endPoint = getSurfacePoint(element, {
          clientX: event.detail.centroid.x,
          clientY: event.detail.centroid.y,
        });

        // Calculate the brush rectangle
        const minX = Math.min(startPoint.x, endPoint.x);
        const maxX = Math.max(startPoint.x, endPoint.x);
        const minY = Math.min(startPoint.y, endPoint.y);
        const maxY = Math.max(startPoint.y, endPoint.y);

        return prev.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }

          let startRatio: number;
          let endRatio: number;
          const reverse = option.reverse;

          if (option.axisDirection === 'x') {
            startRatio = getHorizontalCenterRatio({ x: minX, y: 0 }, drawingArea, reverse);
            endRatio = getHorizontalCenterRatio({ x: maxX, y: 0 }, drawingArea, reverse);
          } else {
            startRatio = getVerticalCenterRatio({ x: 0, y: maxY }, drawingArea, reverse);
            endRatio = getVerticalCenterRatio({ x: 0, y: minY }, drawingArea, reverse);
          }

          // Ensure start < end regardless of reverse
          const minRatio = Math.min(startRatio, endRatio);
          const maxRatio = Math.max(startRatio, endRatio);

          // Calculate the new zoom range based on the current zoom state
          // This is important: we need to map the brush selection ratios to the current zoom range
          const currentStart = zoom.start;
          const currentEnd = zoom.end;
          const currentSpan = currentEnd - currentStart;

          const newStart = currentStart + minRatio * currentSpan;
          const newEnd = currentStart + maxRatio * currentSpan;

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
    };

    const brushEndHandler = instance.addInteractionListener('brushEnd', handleBrushEnd);

    return () => {
      brushEndHandler.cleanup();
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
