'use client';
import * as React from 'react';
import {
  type ChartPlugin,
  selectorChartDrawingArea,
  type ZoomData,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { type PressAndDragEvent } from '@mui/x-internal-gestures/core';
import { type UseChartProZoomSignature } from '../useChartProZoom.types';
import { translateZoom } from './useZoom.utils';
import { selectorPanInteractionConfig } from '../ZoomInteractionConfig.selectors';

export const usePanOnPressAndDrag = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = store.use(selectorChartDrawingArea);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const isInteracting = React.useRef<boolean>(false);
  const accumulatedChange = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const config = store.use(selectorPanInteractionConfig, 'pressAndDrag' as const);

  const isPanOnPressAndDragEnabled: boolean =
    Object.values(optionsLookup).some((v) => v.panning) && Boolean(config);

  React.useEffect(() => {
    if (!isPanOnPressAndDragEnabled) {
      return;
    }

    instance.updateZoomInteractionListeners('zoomPressAndDrag', {
      requiredKeys: config!.requiredKeys,
      pointerMode: config!.pointerMode,
      pointerOptions: {
        mouse: config!.mouse,
        touch: config!.touch,
      },
    });
  }, [isPanOnPressAndDragEnabled, config, instance]);

  // Add event for chart panning with press and drag
  React.useEffect(() => {
    const element = svgRef.current;

    if (element === null || !isPanOnPressAndDragEnabled) {
      return () => {};
    }

    const handlePressAndDragStart = (event: PressAndDragEvent) => {
      if (!(event.detail.target as SVGElement)?.closest('[data-charts-zoom-slider]')) {
        isInteracting.current = true;
        accumulatedChange.current = { x: 0, y: 0 };
      }
    };

    const handlePressAndDragEnd = () => {
      isInteracting.current = false;
    };

    const throttledCallback = rafThrottle(() => {
      const x = accumulatedChange.current.x;
      const y = accumulatedChange.current.y;
      accumulatedChange.current.x = 0;
      accumulatedChange.current.y = 0;
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

    const handlePressAndDrag = (event: PressAndDragEvent) => {
      if (!isInteracting.current) {
        return;
      }
      accumulatedChange.current.x += event.detail.deltaX;
      accumulatedChange.current.y += event.detail.deltaY;
      throttledCallback();
    };

    const pressAndDragHandler = instance.addInteractionListener(
      'zoomPressAndDrag',
      handlePressAndDrag,
    );
    const pressAndDragStartHandler = instance.addInteractionListener(
      'zoomPressAndDragStart',
      handlePressAndDragStart,
    );
    const pressAndDragEndHandler = instance.addInteractionListener(
      'zoomPressAndDragEnd',
      handlePressAndDragEnd,
    );

    return () => {
      pressAndDragStartHandler.cleanup();
      pressAndDragHandler.cleanup();
      pressAndDragEndHandler.cleanup();
      throttledCallback.clear();
    };
  }, [
    instance,
    svgRef,
    isPanOnPressAndDragEnabled,
    optionsLookup,
    drawingArea.width,
    drawingArea.height,
    setZoomDataCallback,
    store,
    isInteracting,
  ]);
};
