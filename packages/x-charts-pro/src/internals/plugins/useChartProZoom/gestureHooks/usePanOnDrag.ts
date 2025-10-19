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
import { selectorPanInteractionConfig } from '../ZoomInteractionConfig.selectors';

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
  const config = useSelector(store, selectorPanInteractionConfig, ['drag' as const]);

  const isPanOnDragEnabled = React.useMemo(
    () => (Object.values(optionsLookup).some((v) => v.panning) && config) || false,
    [optionsLookup, config],
  );

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

    if (element === null || !isPanOnDragEnabled) {
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
    startRef,
  ]);
};
