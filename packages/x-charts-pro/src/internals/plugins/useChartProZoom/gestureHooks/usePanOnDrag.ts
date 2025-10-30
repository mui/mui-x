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
  const deltaRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const config = useSelector(store, selectorPanInteractionConfig, ['drag' as const]);

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

    if (element === null || !isPanOnDragEnabled) {
      return () => {};
    }

    const handlePanStart = (event: PanEvent) => {
      if (!(event.detail.target as SVGElement)?.closest('[data-charts-zoom-slider]')) {
        startRef.current = store.state.zoom.zoomData;
      }
    };
    const handlePanEnd = () => {
      startRef.current = null;
      deltaRef.current = { x: 0, y: 0 };
    };

    const throttledCallback = rafThrottle(() => {
      setZoomDataCallback((prev) => {
        const newZoomData = translateZoom(
          prev,
          deltaRef.current,
          {
            width: drawingArea.width,
            height: drawingArea.height,
          },
          optionsLookup,
        );
        deltaRef.current = { x: 0, y: 0 };
        return newZoomData;
      });
    });

    const handlePan = (event: PanEvent) => {
      deltaRef.current.x += event.detail.deltaX;
      deltaRef.current.y -= event.detail.deltaY;
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
    startRef,
  ]);
};
