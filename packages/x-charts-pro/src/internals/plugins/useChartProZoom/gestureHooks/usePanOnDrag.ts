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

    const panHandler = instance.addInteractionListener<readonly ZoomData[]>('drag', (state) => {
      if (state.pinching) {
        state.cancel();
        return undefined;
      }

      if (!state.memo) {
        state.memo = store.getSnapshot().zoom.zoomData;
      }

      const point = getSVGPoint(element, {
        clientX: state.xy[0],
        clientY: state.xy[1],
      });
      const originalPoint = getSVGPoint(element, {
        clientX: state.initial[0],
        clientY: state.initial[1],
      });
      const movementX = point.x - originalPoint.x;
      const movementY = (point.y - originalPoint.y) * -1;
      const newZoomData = translateZoom(
        state.memo,
        { x: movementX, y: movementY },
        {
          width: drawingArea.width,
          height: drawingArea.height,
        },
        optionsLookup,
      );

      setZoomDataCallback(newZoomData);
      return state.memo;
    });

    return () => {
      panHandler.cleanup();
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
