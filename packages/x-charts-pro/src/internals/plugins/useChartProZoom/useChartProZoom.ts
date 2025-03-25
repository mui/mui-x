'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  ChartPlugin,
  AxisId,
  DefaultizedZoomOptions,
  ZoomData,
  createZoomLookup,
} from '@mui/x-charts/internals';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import debounce from '@mui/utils/debounce';
import { UseChartProZoomSignature } from './useChartProZoom.types';
import { useZoomOnWheel } from './gestureHooks/useZoomOnWheel';
import { useZoomOnPinch } from './gestureHooks/useZoomOnPinch';
import { usePanOnDrag } from './gestureHooks/usePanOnDrag';

// It is helpful to avoid the need to provide the possibly auto-generated id for each axis.
function initializeZoomData(options: Record<AxisId, DefaultizedZoomOptions>) {
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
  const { zoomData: paramsZoomData, onZoomChange } = params;

  // Manage controlled state
  useEnhancedEffect(() => {
    if (paramsZoomData === undefined) {
      return undefined;
    }
    store.update((prevState) => {
      if (process.env.NODE_ENV !== 'production' && !prevState.zoom.isControlled) {
        console.error(
          [
            `MUI X: A chart component is changing the \`zoomData\` from uncontrolled to controlled.`,
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
      debounce(() =>
        store.update((prevState) => {
          return {
            ...prevState,
            zoom: {
              ...prevState.zoom,
              isInteracting: false,
            },
          };
        }),
      ),
    [store],
  );

  // This is throttled. We want to run it at most once per frame.
  // By joining the two, we ensure that interacting and zooming are in sync.
  const setZoomDataCallback = React.useMemo(
    () =>
      rafThrottle((zoomData: ZoomData[] | ((prev: ZoomData[]) => ZoomData[])) => {
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
      }),

    [onZoomChange, store, removeIsInteracting],
  );

  React.useEffect(() => {
    return () => {
      setZoomDataCallback.clear();
      removeIsInteracting.clear();
    };
  }, [setZoomDataCallback, removeIsInteracting]);

  // Add events
  const pluginData = { store, instance, svgRef };

  usePanOnDrag(pluginData, setZoomDataCallback);

  useZoomOnWheel(pluginData, setZoomDataCallback);

  useZoomOnPinch(pluginData, setZoomDataCallback);

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
  return {
    zoom: {
      zoomData:
        // eslint-disable-next-line no-nested-ternary
        zoomData !== undefined
          ? zoomData
          : initialZoom !== undefined
            ? initialZoom
            : initializeZoomData(optionsLookup),
      isInteracting: false,
      isControlled: zoomData !== undefined,
    },
  };
};
