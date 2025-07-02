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
import { isGestureEnabledForPointer } from '../isGestureEnabledForPointer';
import { isKeyPressed } from '../isKeyPressed';
import { selectorPanConfig } from '../ZoomConfig.selectors';

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
  const pressedKeysRef = React.useRef<Set<string>>(new Set());

  const doubleDragConfig = useSelector(store, selectorPanConfig, ['onDoubleDrag' as const]);
  const dragConfig = useSelector(store, selectorPanConfig, ['onDrag' as const]);
  // Default to drag if both are configured
  const useDoubleDrag = doubleDragConfig && !dragConfig;
  const config = useDoubleDrag ? doubleDragConfig : dragConfig;

  // Add event for chart panning
  const isPanEnabled = React.useMemo(
    () => (Object.values(optionsLookup).some((v) => v.panning) && config) || false,
    [optionsLookup, config],
  );

  React.useEffect(() => {
    const pressedKeysSet = pressedKeysRef.current;
    if (!isPanEnabled || !config || useDoubleDrag) {
      return () => {};
    }

    const handleKeyDown = (event: KeyboardEvent) => pressedKeysRef.current.add(event.key);
    const handleKeyUp = (event: KeyboardEvent) => pressedKeysRef.current.delete(event.key);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      pressedKeysSet.clear();
    };
  }, [isPanEnabled, config, useDoubleDrag]);

  React.useEffect(() => {
    const element = svgRef.current;

    if (element === null || !isPanEnabled || !config) {
      return () => {};
    }

    const handlePanStart = (event: PanEvent) => {
      if (
        !isKeyPressed(pressedKeysRef.current, config!.keys) ||
        !isGestureEnabledForPointer(event.detail.srcEvent, config!.mode)
      ) {
        return;
      }
      if (event.detail.target === element || instance.isElementInside(event.detail.target)) {
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

    const panHandler = instance.addInteractionListener(
      useDoubleDrag ? 'doubleFingerPan' : 'pan',
      handlePan,
    );
    const panStartHandler = instance.addInteractionListener(
      useDoubleDrag ? 'doubleFingerPanStart' : 'panStart',
      handlePanStart,
    );
    const panEndHandler = instance.addInteractionListener(
      useDoubleDrag ? 'doubleFingerPanEnd' : 'panEnd',
      handlePanEnd,
    );

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
    config,
    useDoubleDrag,
  ]);
};
