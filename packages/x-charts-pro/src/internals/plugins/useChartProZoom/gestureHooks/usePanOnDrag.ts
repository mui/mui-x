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
  setIsInteracting: React.Dispatch<boolean>,
  setZoomDataCallback: React.Dispatch<ZoomData[] | ((prev: ZoomData[]) => ZoomData[])>,
) => {
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);

  const ref = React.useRef<any | undefined>({});

  // Add event for chart panning
  const isPanEnabled = React.useMemo(
    () => Object.values(optionsLookup).some((v) => v.panning) || false,
    [optionsLookup],
  );

  React.useEffect(() => {
    const element = svgRef.current;

    console.log('instance', instance === ref.current.instance);
    console.log('svgRef', svgRef === ref.current.svgRef);
    console.log('setIsInteracting', setIsInteracting === ref.current.setIsInteracting);
    console.log('isPanEnabled', isPanEnabled === ref.current.isPanEnabled);
    console.log('optionsLookup', optionsLookup === ref.current.optionsLookup);
    console.log('drawingArea.width', drawingArea.width === ref.current.width);
    console.log('drawingArea.height', drawingArea.height === ref.current.height);
    console.log('setZoomDataCallback', setZoomDataCallback === ref.current.setZoomDataCallback);
    console.log('store', store === ref.current.store);

    ref.current = {
      instance,
      svgRef,
      setIsInteracting,
      isPanEnabled,
      optionsLookup,
      width: drawingArea.width,
      height: drawingArea.height,
      setZoomDataCallback,
      store,
    };

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

    const panStartHandler = instance.addInteractionListener('dragStart', () => {
      setIsInteracting(true);
    });

    const panEndHandler = instance.addInteractionListener('dragEnd', () => {
      setIsInteracting(false);
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
  ]);
};
