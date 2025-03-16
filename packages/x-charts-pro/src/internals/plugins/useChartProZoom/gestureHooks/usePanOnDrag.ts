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

export const usePanOnDrag = (
  {
    store,
    instance,
    svgRef,
  }: Pick<Parameters<ChartPlugin<UseChartProZoomSignature>>[0], 'store' | 'instance' | 'svgRef'>,
  interactionTimeoutRef: React.RefObject<number | undefined>,
  setIsInteracting: React.Dispatch<boolean>,
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
      const newZoomData = state.memo.map((zoom) => {
        const options = optionsLookup[zoom.axisId];
        if (!options || !options.panning) {
          return zoom;
        }
        const min = zoom.start;
        const max = zoom.end;
        const span = max - min;
        const MIN_PERCENT = options.minStart;
        const MAX_PERCENT = options.maxEnd;
        const movement = options.axisDirection === 'x' ? movementX : movementY;
        const dimension = options.axisDirection === 'x' ? drawingArea.width : drawingArea.height;
        let newMinPercent = min - (movement / dimension) * span;
        let newMaxPercent = max - (movement / dimension) * span;
        if (newMinPercent < MIN_PERCENT) {
          newMinPercent = MIN_PERCENT;
          newMaxPercent = newMinPercent + span;
        }
        if (newMaxPercent > MAX_PERCENT) {
          newMaxPercent = MAX_PERCENT;
          newMinPercent = newMaxPercent - span;
        }
        if (
          newMinPercent < MIN_PERCENT ||
          newMaxPercent > MAX_PERCENT ||
          span < options.minSpan ||
          span > options.maxSpan
        ) {
          return zoom;
        }
        return {
          ...zoom,
          start: newMinPercent,
          end: newMaxPercent,
        };
      });
      setZoomDataCallback(newZoomData);
      return state.memo;
    });

    const panStartHandler = instance.addInteractionListener('dragStart', (state) => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      setIsInteracting(true);
      return state.memo;
    });

    const panEndHandler = instance.addInteractionListener('dragEnd', (state) => {
      setIsInteracting(false);
      return state.memo;
    });

    return () => {
      panHandler.cleanup();
      panStartHandler.cleanup();
      panEndHandler.cleanup();
    };
  }, [
    instance,
    svgRef,
    setIsInteracting,
    isPanEnabled,
    optionsLookup,
    drawingArea.width,
    drawingArea.height,
    setZoomDataCallback,
    store,
    interactionTimeoutRef,
  ]);
};
