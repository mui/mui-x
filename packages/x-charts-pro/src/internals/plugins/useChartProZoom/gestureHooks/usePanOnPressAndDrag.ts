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
import { PressAndDragEvent } from '@mui/x-internal-gestures/core';
import { UseChartProZoomSignature } from '../useChartProZoom.types';
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
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);
  const startRef = React.useRef<readonly ZoomData[]>(null);
  const config = useSelector(store, selectorPanInteractionConfig, ['pressAndDrag' as const]);

  const isPanOnPressAndDragEnabled = React.useMemo(
    () => (Object.values(optionsLookup).some((v) => v.panning) && config) || false,
    [optionsLookup, config],
  );

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
        startRef.current = store.value.zoom.zoomData;
      }
    };

    const handlePressAndDragEnd = () => {
      startRef.current = null;
    };

    const throttledCallback = rafThrottle(
      (event: PressAndDragEvent, zoomData: readonly ZoomData[]) => {
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
      },
    );

    const handlePressAndDrag = (event: PressAndDragEvent) => {
      const zoomData = startRef.current;
      if (!zoomData) {
        return;
      }
      throttledCallback(event, zoomData);
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
    startRef,
  ]);
};
