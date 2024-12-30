'use client';
import * as React from 'react';
import {
  ChartPlugin,
  AxisId,
  DefaultizedZoomOption,
  useSelector,
  getSVGPoint,
  selectorChartDrawingArea,
  ZoomData,
} from '@mui/x-charts/internals';
import { UseChartProZoomSignature } from './useChartProZoom.types';
import { defaultizeZoom } from './defaultizeZoom';
import {
  getDiff,
  getHorizontalCenterRatio,
  getPinchScaleRatio,
  getVerticalCenterRatio,
  getWheelScaleRatio,
  isSpanValid,
  preventDefault,
  zoomAtPoint,
} from './useChartProZoom.utils';
import { selectorChartZoomOptions } from './useChartProZoom.selectors';

// It is helpful to avoid the need to provide the possibly auto-generated id for each axis.
function initializeZoomData(options: Record<AxisId, DefaultizedZoomOption>) {
  return Object.values(options).map(({ axisId, minStart: start, maxEnd: end }) => ({
    axisId,
    start,
    end,
  }));
}

export const useChartProZoom: ChartPlugin<UseChartProZoomSignature> = ({
  store,
  instance,
  svgRef,
  params,
}) => {
  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const options = useSelector(store, selectorChartZoomOptions);
  const isZoomEnabled = Object.keys(options).length > 0;

  // Add events
  const eventCacheRef = React.useRef<PointerEvent[]>([]);
  const eventPrevDiff = React.useRef<number>(0);
  const interactionTimeoutRef = React.useRef<number | undefined>(undefined);

  const setIsInteracting = React.useCallback(
    (isInteracting: boolean) => {
      store.update((prev) => ({ ...prev, zoom: { ...prev.zoom, isInteracting } }));
    },
    [store],
  );

  const setZoomDataCallback = React.useCallback(
    (zoomData: ZoomData[] | ((prev: ZoomData[]) => ZoomData[])) => {
      store.update((prevState) => {
        const newZoomData =
          typeof zoomData === 'function' ? zoomData(prevState.zoom.zoomData) : zoomData;
        params.onZoomChange?.(newZoomData);

        return {
          ...prevState,
          zoom: {
            ...prevState.zoom,
            zoomData: newZoomData,
          },
        };
      });
    },

    [params, store],
  );

  // Add event for chart panning
  const isPanEnabled = React.useMemo(
    () => Object.values(options).some((v) => v.panning) || false,
    [options],
  );
  const isDraggingRef = React.useRef(false);
  const touchStartRef = React.useRef<{ x: number; y: number; zoomData: ZoomData[] } | null>(null);
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isPanEnabled) {
      return () => {};
    }
    const handlePan = (event: PointerEvent) => {
      if (element === null || !isDraggingRef.current || eventCacheRef.current.length > 1) {
        return;
      }
      if (touchStartRef.current == null) {
        return;
      }
      const point = getSVGPoint(element, event);
      const movementX = point.x - touchStartRef.current.x;
      const movementY = (point.y - touchStartRef.current.y) * -1;
      const newZoomData = touchStartRef.current.zoomData.map((zoom) => {
        const option = options[zoom.axisId];
        if (!option || !option.panning) {
          return zoom;
        }
        const min = zoom.start;
        const max = zoom.end;
        const span = max - min;
        const MIN_PERCENT = option.minStart;
        const MAX_PERCENT = option.maxEnd;
        const movement = option.axisDirection === 'x' ? movementX : movementY;
        const dimension = option.axisDirection === 'x' ? drawingArea.width : drawingArea.height;
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
          span < option.minSpan ||
          span > option.maxSpan
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
    };
    const handleDown = (event: PointerEvent) => {
      eventCacheRef.current.push(event);
      const point = getSVGPoint(element, event);
      if (!instance.isPointInside(point)) {
        return;
      }
      // If there is only one pointer, prevent selecting text
      if (eventCacheRef.current.length === 1) {
        event.preventDefault();
      }
      isDraggingRef.current = true;
      setIsInteracting(true);
      touchStartRef.current = {
        x: point.x,
        y: point.y,
        zoomData: store.getSnapshot().zoom.zoomData,
      };
    };
    const handleUp = (event: PointerEvent) => {
      eventCacheRef.current.splice(
        eventCacheRef.current.findIndex((cachedEvent) => cachedEvent.pointerId === event.pointerId),
        1,
      );
      setIsInteracting(false);
      isDraggingRef.current = false;
      touchStartRef.current = null;
    };
    element.addEventListener('pointerdown', handleDown);
    document.addEventListener('pointermove', handlePan);
    document.addEventListener('pointerup', handleUp);
    document.addEventListener('pointercancel', handleUp);
    document.addEventListener('pointerleave', handleUp);
    return () => {
      element.removeEventListener('pointerdown', handleDown);
      document.removeEventListener('pointermove', handlePan);
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointercancel', handleUp);
      document.removeEventListener('pointerleave', handleUp);
    };
  }, [
    instance,
    svgRef,
    isDraggingRef,
    setIsInteracting,
    isPanEnabled,
    options,
    drawingArea.width,
    drawingArea.height,
    setZoomDataCallback,
    store,
  ]);

  // Add event for chart zoom in/out
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isZoomEnabled) {
      return () => {};
    }

    const wheelHandler = (event: WheelEvent) => {
      if (element === null) {
        return;
      }

      const point = getSVGPoint(element, event);

      if (!instance.isPointInside(point)) {
        return;
      }

      event.preventDefault();
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      setIsInteracting(true);
      // Debounce transition to `isInteractive=false`.
      // Useful because wheel events don't have an "end" event.
      interactionTimeoutRef.current = window.setTimeout(() => {
        setIsInteracting(false);
      }, 166);

      setZoomDataCallback((prevZoomData) => {
        return prevZoomData.map((zoom) => {
          const option = options[zoom.axisId];
          if (!option) {
            return zoom;
          }

          const centerRatio =
            option.axisDirection === 'x'
              ? getHorizontalCenterRatio(point, drawingArea)
              : getVerticalCenterRatio(point, drawingArea);

          const { scaleRatio, isZoomIn } = getWheelScaleRatio(event, option.step);
          const [newMinRange, newMaxRange] = zoomAtPoint(centerRatio, scaleRatio, zoom, option);

          if (!isSpanValid(newMinRange, newMaxRange, isZoomIn, option)) {
            return zoom;
          }

          return { axisId: zoom.axisId, start: newMinRange, end: newMaxRange };
        });
      });
    };

    function pointerDownHandler(event: PointerEvent) {
      eventCacheRef.current.push(event);
      setIsInteracting(true);
    }

    function pointerMoveHandler(event: PointerEvent) {
      if (element === null) {
        return;
      }

      const index = eventCacheRef.current.findIndex(
        (cachedEv) => cachedEv.pointerId === event.pointerId,
      );
      eventCacheRef.current[index] = event;

      // Not a pinch gesture
      if (eventCacheRef.current.length !== 2) {
        return;
      }

      const firstEvent = eventCacheRef.current[0];
      const curDiff = getDiff(eventCacheRef.current);

      setZoomDataCallback((prevZoomData) => {
        const newZoomData = prevZoomData.map((zoom) => {
          const option = options[zoom.axisId];
          if (!option) {
            return zoom;
          }

          const { scaleRatio, isZoomIn } = getPinchScaleRatio(
            curDiff,
            eventPrevDiff.current,
            option.step,
          );

          // If the scale ratio is 0, it means the pinch gesture is not valid.
          if (scaleRatio === 0) {
            return zoom;
          }

          const point = getSVGPoint(element, firstEvent);

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
        eventPrevDiff.current = curDiff;
        return newZoomData;
      });
    }

    function pointerUpHandler(event: PointerEvent) {
      eventCacheRef.current.splice(
        eventCacheRef.current.findIndex((cachedEvent) => cachedEvent.pointerId === event.pointerId),
        1,
      );

      if (eventCacheRef.current.length < 2) {
        eventPrevDiff.current = 0;
      }

      if (event.type === 'pointerup' || event.type === 'pointercancel') {
        setIsInteracting(false);
      }
    }

    element.addEventListener('wheel', wheelHandler);
    element.addEventListener('pointerdown', pointerDownHandler);
    element.addEventListener('pointermove', pointerMoveHandler);
    element.addEventListener('pointerup', pointerUpHandler);
    element.addEventListener('pointercancel', pointerUpHandler);
    element.addEventListener('pointerout', pointerUpHandler);
    element.addEventListener('pointerleave', pointerUpHandler);

    // Prevent zooming the entire page on touch devices
    element.addEventListener('touchstart', preventDefault);
    element.addEventListener('touchmove', preventDefault);

    return () => {
      element.removeEventListener('wheel', wheelHandler);
      element.removeEventListener('pointerdown', pointerDownHandler);
      element.removeEventListener('pointermove', pointerMoveHandler);
      element.removeEventListener('pointerup', pointerUpHandler);
      element.removeEventListener('pointercancel', pointerUpHandler);
      element.removeEventListener('pointerout', pointerUpHandler);
      element.removeEventListener('pointerleave', pointerUpHandler);
      element.removeEventListener('touchstart', preventDefault);
      element.removeEventListener('touchmove', preventDefault);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [
    svgRef,
    drawingArea,
    isZoomEnabled,
    options,
    setIsInteracting,
    instance,
    setZoomDataCallback,
  ]);

  return {
    publicAPI: {
      setZoomData: setZoomDataCallback,
    },
    instance: {
      setZoomData: setZoomDataCallback,
    },
  };
};

useChartProZoom.params = {
  initialZoom: true,
  onZoomChange: true,
};

useChartProZoom.getDefaultizedParams = ({ params }) => {
  const options = {
    ...params.defaultizedXAxis.reduce<Record<AxisId, DefaultizedZoomOption>>((acc, v) => {
      const { zoom, id: axisId } = v;
      const defaultizedZoom = defaultizeZoom(zoom, axisId, 'x');
      if (defaultizedZoom) {
        acc[axisId] = defaultizedZoom;
      }
      return acc;
    }, {}),
    ...params.defaultizedYAxis.reduce<Record<AxisId, DefaultizedZoomOption>>((acc, v) => {
      const { zoom, id: axisId } = v;
      const defaultizedZoom = defaultizeZoom(zoom, axisId, 'y');
      if (defaultizedZoom) {
        acc[axisId] = defaultizedZoom;
      }
      return acc;
    }, {}),
  };

  return {
    ...params,
    options,
  };
};

useChartProZoom.getInitialState = (params) => {
  return {
    zoom: {
      options: params.options,
      zoomData:
        params.initialZoom === undefined ? initializeZoomData(params.options) : params.initialZoom,
      isInteracting: false,
    },
  };
};
