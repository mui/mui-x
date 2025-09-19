'use client';
import * as React from 'react';
import {
  ChartPlugin,
  AxisId,
  ZoomData,
  useSelector,
  selectorChartZoomOptionsLookup,
  createZoomLookup,
  selectorChartAxisZoomOptionsLookup,
} from '@mui/x-charts/internals';
import debounce from '@mui/utils/debounce';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { useEventCallback } from '@mui/material/utils';
import { calculateZoom } from './calculateZoom';
import { UseChartProZoomSignature } from './useChartProZoom.types';
import { useZoomOnWheel } from './gestureHooks/useZoomOnWheel';
import { useZoomOnPinch } from './gestureHooks/useZoomOnPinch';
import { usePanOnDrag } from './gestureHooks/usePanOnDrag';
import { initializeZoomInteractionConfig } from './initializeZoomInteractionConfig';
import { initializeZoomData } from './initializeZoomData';

export const useChartProZoom: ChartPlugin<UseChartProZoomSignature> = (pluginData) => {
  const { store, params } = pluginData;
  const {
    zoomData: paramsZoomData,
    onZoomChange: onZoomChangeProp,
    zoomInteractionConfig,
  } = params;

  const onZoomChange = useEventCallback(onZoomChangeProp ?? (() => {}));
  const optionsLookup = useSelector(store, selectorChartZoomOptionsLookup);

  useEffectAfterFirstRender(() => {
    store.update((prevState) => {
      return {
        ...prevState,
        zoom: {
          ...prevState.zoom,
          zoomInteractionConfig: initializeZoomInteractionConfig(zoomInteractionConfig),
        },
      };
    });
  }, [store, zoomInteractionConfig]);

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

  const setAxisZoomData = React.useCallback(
    (axisId: AxisId, zoomData: ZoomData | ((prev: ZoomData) => ZoomData)) => {
      setZoomDataCallback((prev) =>
        prev.map((prevZoom) => {
          if (prevZoom.axisId !== axisId) {
            return prevZoom;
          }

          return typeof zoomData === 'function' ? zoomData(prevZoom) : zoomData;
        }),
      );
    },
    [setZoomDataCallback],
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
  }, [removeIsInteracting]);

  // Add events
  usePanOnDrag(pluginData, setZoomDataCallback);

  useZoomOnWheel(pluginData, setZoomDataCallback);

  useZoomOnPinch(pluginData, setZoomDataCallback);

  const zoom = React.useCallback(
    (step: number) => {
      setZoomDataCallback((prev) =>
        prev.map((zoomData) => {
          const zoomOptions = selectorChartAxisZoomOptionsLookup(
            store.getSnapshot(),
            zoomData.axisId,
          );

          return calculateZoom(zoomData, step, zoomOptions);
        }),
      );
    },
    [setZoomDataCallback, store],
  );

  const zoomIn = React.useCallback(() => zoom(0.1), [zoom]);
  const zoomOut = React.useCallback(() => zoom(-0.1), [zoom]);

  return {
    publicAPI: {
      setZoomData: setZoomDataCallback,
      setAxisZoomData,
      zoomIn,
      zoomOut,
    },
    instance: {
      setZoomData: setZoomDataCallback,
      setAxisZoomData,
      moveZoomRange,
      zoomIn,
      zoomOut,
    },
  };
};

useChartProZoom.params = {
  initialZoom: true,
  onZoomChange: true,
  zoomData: true,
  zoomInteractionConfig: true,
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
      zoomInteractionConfig: initializeZoomInteractionConfig(params.zoomInteractionConfig),
    },
  };
};
