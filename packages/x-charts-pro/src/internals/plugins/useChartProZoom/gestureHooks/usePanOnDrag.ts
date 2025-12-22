'use client';
import * as React from 'react';
import {
  type ChartPlugin,
  selectorChartDrawingArea,
  type ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { type PanEvent } from '@mui/x-internal-gestures/core';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';
import { translateZoom } from './useZoom.utils';
import { selectorPanInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const usePanOnDrag = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const config = store.use(selectorPanInteractionConfig, 'drag' as const);

  const isPanOnDragEnabled: boolean =
    Object.values(optionsLookup).some((v) => v.panning) && Boolean(config);

  React.useEffect(() => {
    if (!isPanOnDragEnabled) {
      return;
    }

    instance.updateZoomInteractionListeners('zoomPan', {
      requiredKeys: config!.requiredKeys,
      pointerMode: config!.pointerMode,
      pointerOptions: {
        mouse: config!.mouse,
        touch: config!.touch,
      },
    });
  }, [isPanOnDragEnabled, config, instance]);

  // Add event for chart panning
  React.useEffect(() => {
    const element = svgRef.current;
    let isInteracting = false;
    const accumulatedChange = { x: 0, y: 0 };

    if (element === null || !isPanOnDragEnabled) {
      return () => {};
    }

    const handlePanStart = (event: PanEvent) => {
      if (!(event.detail.target as SVGElement)?.closest('[data-charts-zoom-slider]')) {
        isInteracting = true;
      }
    };
    const handlePanEnd = () => {
      isInteracting = false;
    };

    const throttledCallback = rafThrottle(() => {
      const x = accumulatedChange.x;
      const y = accumulatedChange.y;
      accumulatedChange.x = 0;
      accumulatedChange.y = 0;
      setZoomDataCallback((prev) =>
        translateZoom(
          prev,
          { x, y: -y },
          {
            width: drawingArea.width,
            height: drawingArea.height,
          },
          optionsLookup,
        ),
      );
    });

    const handlePan = (event: PanEvent) => {
      if (!isInteracting) {
        return;
      }
      accumulatedChange.x += event.detail.deltaX;
      accumulatedChange.y += event.detail.deltaY;
      throttledCallback();
    };

    const panHandler = instance.addInteractionListener('zoomPan', handlePan);
    const panStartHandler = instance.addInteractionListener('zoomPanStart', handlePanStart);
    const panEndHandler = instance.addInteractionListener('zoomPanEnd', handlePanEnd);

    return () => {
      panStartHandler.cleanup();
      panHandler.cleanup();
      panEndHandler.cleanup();
      throttledCallback.clear();
    };
  }, [
    instance,
    svgRef,
    isPanOnDragEnabled,
    optionsLookup,
    drawingArea.width,
    drawingArea.height,
    setZoomDataCallback,
    store,
  ]);
};
