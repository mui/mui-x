'use client';
import * as React from 'react';
import {
  ChartPlugin,
  AxisId,
  DefaultizedZoomOptions,
  useSelector,
  getSVGPoint,
  selectorChartDrawingArea,
  ZoomData,
  createZoomLookup,
  selectorChartZoomOptionsLookup,
} from '@mui/x-charts/internals';
import { useEventCallback } from '@mui/material/utils';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import debounce from '@mui/utils/debounce';
import { UseChartProZoomSignature } from './useChartProZoom.types';
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

// It is helpful to avoid the need to provide the possibly auto-generated id for each axis.
export function initializeZoomData(
  options: Record<AxisId, Pick<DefaultizedZoomOptions, 'axisId' | 'minStart' | 'maxEnd'>>,
  zoomData?: readonly ZoomData[],
) {
  const zoomDataMap = new Map<AxisId, ZoomData>();

  zoomData?.forEach((zoom) => {
    const option = options[zoom.axisId];
    if (option) {
      zoomDataMap.set(zoom.axisId, zoom);
    }
  });

  return Object.values(options).map(({ axisId, minStart: start, maxEnd: end }) => {
    if (zoomDataMap.has(axisId)) {
      return zoomDataMap.get(axisId)!;
    }

    return {
      axisId,
      start,
      end,
    };
  });
}

export const useChartProZoom: ChartPlugin<UseChartProZoomSignature> = ({
  store,
  instance,
  svgRef,
  params,
}) => {
  const { zoomData: paramsZoomData, onZoomChange: onZoomChangeProp } = params;

  const drawingArea = useSelector(store, selectorChartDrawingArea);
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);
  const isZoomEnabled = Object.keys(optionsLookup).length > 0;
  const onZoomChange = useEventCallback(onZoomChangeProp ?? (() => {}));

  // Manage controlled state
  React.useEffect(() => {
    if (paramsZoomData === undefined) {
      return undefined;
    }
    store.update((prevState) => {
      if (process.env.NODE_ENV !== 'production' && !prevState.zoom.isControlled) {
        console.error(
          [
            `MUI X Charts: A chart component is changing the \`zoomData\` from uncontrolled to controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            'Decide between using a controlled or uncontrolled for the lifetime of the component.',
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ].join('\n'),
        );
      }

      return {
        ...prevState,
        zoom: {
          ...prevState.zoom,
          isInteracting: true,
          zoomData: paramsZoomData,
        },
      };
    });

    const timeout = setTimeout(() => {
      store.update((prevState) => {
        return {
          ...prevState,
          zoom: {
            ...prevState.zoom,
            isInteracting: false,
          },
        };
      });
    }, 166);

    return () => {
      clearTimeout(timeout);
    };
  }, [store, paramsZoomData]);

  // This is debounced. We want to run it only once after the interaction ends.
  const removeIsInteracting = React.useMemo(
    () =>
      debounce(
        () =>
          store.update((prevState) => {
            return {
              ...prevState,
              zoom: {
                ...prevState.zoom,
                isInteracting: false,
              },
            };
          }),
        166,
      ),
    [store],
  );

  const setZoomDataCallback = React.useCallback(
    (zoomData: ZoomData[] | ((prev: ZoomData[]) => ZoomData[])) => {
      store.update((prevState) => {
        const newZoomData =
          typeof zoomData === 'function' ? zoomData([...prevState.zoom.zoomData]) : zoomData;
        onZoomChange?.(newZoomData);
        if (prevState.zoom.isControlled) {
          return prevState;
        }

        removeIsInteracting();
        return {
          ...prevState,
          zoom: {
            ...prevState.zoom,
            isInteracting: true,
            zoomData: newZoomData,
          },
        };
      });
    },
    [onZoomChange, store, removeIsInteracting],
  );

  const moveZoomRange = React.useCallback(
    (axisId: AxisId, by: number) => {
      setZoomDataCallback((prevZoomData) => {
        return prevZoomData.map((zoom) => {
          if (zoom.axisId !== axisId) {
            return zoom;
          }

          const options = optionsLookup[axisId];

          if (!options) {
            return zoom;
          }

          let start: number = zoom.start;
          let end: number = zoom.end;

          if (by > 0) {
            const span = end - start;
            end = Math.min(end + by, options.maxEnd);
            start = end - span;
          } else {
            const span = end - start;
            start = Math.max(start + by, options.minStart);
            end = start + span;
          }

          return { ...zoom, start, end };
        });
      });
    },
    [optionsLookup, setZoomDataCallback],
  );

  React.useEffect(() => {
    return () => {
      removeIsInteracting.clear();
    };
  }, [setZoomDataCallback, removeIsInteracting]);

  // Add events
  const panningEventCacheRef = React.useRef<PointerEvent[]>([]);
  const zoomEventCacheRef = React.useRef<PointerEvent[]>([]);
  const eventPrevDiff = React.useRef<number>(0);

  // Add event for chart panning
  const isPanEnabled = React.useMemo(
    () => Object.values(optionsLookup).some((v) => v.panning) || false,
    [optionsLookup],
  );

  const isDraggingRef = React.useRef(false);
  const touchStartRef = React.useRef<{
    x: number;
    y: number;
    zoomData: readonly ZoomData[];
  } | null>(null);
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !isPanEnabled) {
      return () => {};
    }

    const throttledHandlePan = rafThrottle(
      (
        touchStart: {
          x: number;
          y: number;
          zoomData: readonly ZoomData[];
        },
        point: DOMPoint,
      ) => {
        const movementX = point.x - touchStart.x;
        const movementY = (point.y - touchStart.y) * -1;
        const newZoomData = touchStart.zoomData.map((zoom) => {
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
      },
    );

    const handlePan = (event: PointerEvent) => {
      if (element === null || !isDraggingRef.current || panningEventCacheRef.current.length > 1) {
        return;
      }
      if (touchStartRef.current == null) {
        return;
      }

      const touchStart = touchStartRef.current;
      const point = getSVGPoint(element, event);

      throttledHandlePan(touchStart, point);
    };

    const handleDown = (event: PointerEvent) => {
      panningEventCacheRef.current.push(event);
      const point = getSVGPoint(element, event);
      if (!instance.isPointInside(point)) {
        return;
      }
      // If there is only one pointer, prevent selecting text
      if (panningEventCacheRef.current.length === 1) {
        event.preventDefault();
      }
      isDraggingRef.current = true;
      touchStartRef.current = {
        x: point.x,
        y: point.y,
        zoomData: store.getSnapshot().zoom.zoomData,
      };
    };
    const handleUp = (event: PointerEvent) => {
      panningEventCacheRef.current.splice(
        panningEventCacheRef.current.findIndex(
          (cachedEvent) => cachedEvent.pointerId === event.pointerId,
        ),
        1,
      );
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
      throttledHandlePan.clear();
    };
  }, [
    instance,
    svgRef,
    isDraggingRef,
    isPanEnabled,
    optionsLookup,
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

    const rafThrottledSetZoomData = rafThrottle(setZoomDataCallback);

    const wheelHandler = (event: WheelEvent) => {
      if (element === null) {
        return;
      }

      const point = getSVGPoint(element, event);

      if (!instance.isPointInside(point)) {
        return;
      }

      event.preventDefault();

      /*
       * Need to throttle `setZoomDataCallback` instead of `wheelHandler` because we're calling `event.preventDefault()`.
       * If we throttle the event, then some events' default behavior won't be prevented and the page will scroll while
       * the user is trying to zoom in.
       */
      rafThrottledSetZoomData((prevZoomData) => {
        return prevZoomData.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
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
      zoomEventCacheRef.current.push(event);
    }

    const pointerMoveHandler = rafThrottle(function pointerMoveHandler(event: PointerEvent) {
      if (element === null) {
        return;
      }

      const index = zoomEventCacheRef.current.findIndex(
        (cachedEv) => cachedEv.pointerId === event.pointerId,
      );
      zoomEventCacheRef.current[index] = event;

      // Not a pinch gesture
      if (zoomEventCacheRef.current.length !== 2) {
        return;
      }

      const firstEvent = zoomEventCacheRef.current[0];
      const curDiff = getDiff(zoomEventCacheRef.current);

      setZoomDataCallback((prevZoomData) => {
        const newZoomData = prevZoomData.map((zoom) => {
          const option = optionsLookup[zoom.axisId];
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
    });

    function pointerUpHandler(event: PointerEvent) {
      zoomEventCacheRef.current.splice(
        zoomEventCacheRef.current.findIndex(
          (cachedEvent) => cachedEvent.pointerId === event.pointerId,
        ),
        1,
      );

      if (zoomEventCacheRef.current.length < 2) {
        eventPrevDiff.current = 0;
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

      pointerMoveHandler.clear();
      rafThrottledSetZoomData.clear();
    };
  }, [svgRef, drawingArea, isZoomEnabled, optionsLookup, instance, setZoomDataCallback]);

  return {
    publicAPI: {
      setZoomData: setZoomDataCallback,
    },
    instance: {
      setZoomData: setZoomDataCallback,
      moveZoomRange,
    },
  };
};

useChartProZoom.params = {
  initialZoom: true,
  onZoomChange: true,
  zoomData: true,
};

useChartProZoom.getDefaultizedParams = ({ params }) => {
  return {
    ...params,
  };
};

useChartProZoom.getInitialState = (params) => {
  const { initialZoom, zoomData, defaultizedXAxis, defaultizedYAxis } = params;

  const optionsLookup = {
    ...createZoomLookup('x')(defaultizedXAxis),
    ...createZoomLookup('y')(defaultizedYAxis),
  };
  const userZoomData =
    // eslint-disable-next-line no-nested-ternary
    zoomData !== undefined ? zoomData : initialZoom !== undefined ? initialZoom : undefined;

  return {
    zoom: {
      zoomData: initializeZoomData(optionsLookup, userZoomData),
      isInteracting: false,
      isControlled: zoomData !== undefined,
    },
  };
};
