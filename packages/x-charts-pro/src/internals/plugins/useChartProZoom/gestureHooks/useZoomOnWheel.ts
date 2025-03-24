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
  getWheelScaleRatio,
  isSpanValid,
  zoomAtPoint,
} from './useZoom.utils';

export const useZoomOnWheel = (
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
  const isZoomEnabled = Object.keys(optionsLookup).length > 0;

  // Add event for chart zoom in/out
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomEnabled) {
      return () => {};
    }

    const wheelStartHandler = instance.addInteractionListener('wheel', (state) => {
      const point = getSVGPoint(element, state.event);

      if (!instance.isPointInside(point)) {
        return;
      }

      if (!state.dragging) {
        setIsInteracting(true);
      }
    });

    const wheelEndHandler = instance.addInteractionListener('wheelEnd', (state) => {
      if (!state.dragging && !state.pinching) {
        setIsInteracting(false);
      }
    });

    const zoomOnWheelHandler = instance.addInteractionListener('wheel', (state) => {
      const point = getSVGPoint(element, state.event);

      if (!instance.isPointInside(point)) {
        return;
      }

      if (!state.last) {
        state.event.preventDefault();
      }

      setZoomDataCallback((prevZoomData) => {
        return prevZoomData.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
          if (!option) {
            return zoom;
          }
          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea)
              : getVerticalCenterRatio(point, drawingArea);

          const { scaleRatio, isZoomIn } = getWheelScaleRatio(state.event, option.step);
          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return zoom;
          }

          return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
        });
      });
    });

    return () => {
      zoomOnWheelHandler.cleanup();
      wheelStartHandler.cleanup();
      wheelEndHandler.cleanup();
    };
  }, [
    svgRef,
    drawingArea,
    isZoomEnabled,
    optionsLookup,
    setIsInteracting,
    instance,
    setZoomDataCallback,
  ]);
};
