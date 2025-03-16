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
import {
  getHorizontalCenterRatio,
  getVerticalCenterRatio,
  isSpanValid,
  zoomAtPoint,
} from '../useChartProZoom.utils';

export const useZoomOnPinch = (
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
  const isZoomEnabled = Object.keys(optionsLookup).length > 0;

  // Zoom on pinch
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomEnabled) {
      return () => {};
    }

    const zoomStartHandler = instance.addInteractionListener('pinchStart', () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      setIsInteracting(true);
    });

    const zoomHandler = instance.addInteractionListener('pinch', (state) => {
      setZoomDataCallback((prevZoomData) => {
        const newZoomData = prevZoomData.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }

          const scaledStep = option.step / 1000;
          const isZoomIn = state.direction[0] > 0;
          const scaleRatio = 1 + (isZoomIn ? scaledStep : -scaledStep);

          // If the scale ratio is 0, it means the pinch gesture is not valid.
          if (scaleRatio === 0) {
            return zoom;
          }

          const point = getSVGPoint(element, {
            clientX: state.origin[0],
            clientY: state.origin[1],
          });

          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea)
              : getVerticalCenterRatio(point, drawingArea);

          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return zoom;
          }
          return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
        });
        return newZoomData;
      });
    });

    const zoomEndHandler = instance.addInteractionListener('pinchEnd', () => {
      setIsInteracting(false);
    });

    return () => {
      zoomStartHandler.cleanup();
      zoomHandler.cleanup();
      zoomEndHandler.cleanup();
    };
  }, [
    svgRef,
    drawingArea,
    isZoomEnabled,
    optionsLookup,
    setIsInteracting,
    instance,
    setZoomDataCallback,
    interactionTimeoutRef,
  ]);
};
