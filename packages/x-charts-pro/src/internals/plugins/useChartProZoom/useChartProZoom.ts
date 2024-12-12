'use client';
import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
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
  // models,
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

  // Default zoom data is initialized only once when uncontrolled. If the user changes the options
  // after the initial render, the zoom data will not be updated until the next zoom interaction.
  // This is required to avoid warnings about controlled/uncontrolled components.
  const defaultZoomData = React.useRef<ZoomData[]>(initializeZoomData(options));

  const [zoomData, setZoomData] = useControlled<ZoomData[]>({
    controlled: params.zoom,
    // eslint-disable-next-line react-compiler/react-compiler
    default: defaultZoomData.current,
    name: 'ZoomProvider',
    state: 'zoom',
  });

  useEnhancedEffect(() => {
    store.update((prevState) => ({
      ...prevState,
      zoom: {
        ...prevState.zoom,
        zoomData,
      },
    }));
  }, [store, zoomData]);

  const setZoomDataCallback = React.useCallback(
    (newZoomData) => {
      setZoomData(newZoomData);
      params.onZoomChange?.(newZoomData);
    },
    [setZoomData, params],
  );

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
    setZoomData,
    drawingArea,
    isZoomEnabled,
    options,
    setIsInteracting,
    instance,
    setZoomDataCallback,
  ]);

  return {};
};

useChartProZoom.params = {
  zoom: true,
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

// useChartProZoom.models = {
//   zoom: {
//     getDefaultValue: (params) => initializeZoomData(params.options),
//   },
// };

useChartProZoom.getInitialState = (params) => {
  return {
    zoom: {
      options: params.options,
      zoomData: params.zoom === undefined ? initializeZoomData(params.options) : params.zoom,
      isInteracting: false,
    },
  };
};
