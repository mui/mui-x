'use client';
import * as React from 'react';
import {
  type ChartPlugin,
  type AxisId,
  type ZoomData,
  selectorChartZoomOptionsLookup,
  createZoomLookup,
  selectorChartAxisZoomOptionsLookup,
} from '@mui/x-charts/internals';
import debounce from '@mui/utils/debounce';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { useEventCallback } from '@mui/material/utils';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { calculateZoom } from './calculateZoom';
import { type UseChartProZoomSignature } from './useChartProZoom.types';
import { useZoomOnWheel } from './gestureHooks/useZoomOnWheel';
import { useZoomOnPinch } from './gestureHooks/useZoomOnPinch';
import { usePanOnDrag } from './gestureHooks/usePanOnDrag';
import { usePanOnWheel } from './gestureHooks/usePanOnWheel';
import { useZoomOnTapAndDrag } from './gestureHooks/useZoomOnTapAndDrag';
import { usePanOnPressAndDrag } from './gestureHooks/usePanOnPressAndDrag';
import { useZoomOnBrush } from './gestureHooks/useZoomOnBrush';
import { useZoomOnDoubleTapReset } from './gestureHooks/useZoomOnDoubleTapReset';
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
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);

  useEffectAfterFirstRender(() => {
    store.set('zoom', {
      ...store.state.zoom,
      zoomInteractionConfig: initializeZoomInteractionConfig(zoomInteractionConfig, optionsLookup),
    });
  }, [store, zoomInteractionConfig, optionsLookup]);

  // This is debounced. We want to run it only once after the interaction ends.
  const removeIsInteracting = React.useMemo(
    () =>
      debounce(
        () =>
          store.set('zoom', {
            ...store.state.zoom,
            isInteracting: false,
          }),
        166,
      ),
    [store],
  );

  // Manage controlled state
  React.useEffect(() => {
    if (paramsZoomData === undefined) {
      return;
    }

    if (process.env.NODE_ENV !== 'production' && !store.state.zoom.isControlled) {
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
    store.set('zoom', {
      ...store.state.zoom,
      isInteracting: true,
      zoomData: paramsZoomData,
    });
    removeIsInteracting();
  }, [store, paramsZoomData, removeIsInteracting]);

  const setZoomDataCallback = React.useCallback(
    (zoomData: ZoomData[] | ((prev: ZoomData[]) => ZoomData[])) => {
      const newZoomData =
        typeof zoomData === 'function' ? zoomData([...store.state.zoom.zoomData]) : zoomData;

      if (isDeepEqual(store.state.zoom.zoomData, newZoomData)) {
        return;
      }

      onZoomChange(newZoomData);
      if (store.state.zoom.isControlled) {
        store.set('zoom', {
          ...store.state.zoom,
          isInteracting: true,
        });
      } else {
        store.set('zoom', {
          ...store.state.zoom,
          isInteracting: true,
          zoomData: newZoomData,
        });
        removeIsInteracting();
      }
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

  usePanOnPressAndDrag(pluginData, setZoomDataCallback);

  usePanOnWheel(pluginData, setZoomDataCallback);

  useZoomOnWheel(pluginData, setZoomDataCallback);

  useZoomOnPinch(pluginData, setZoomDataCallback);

  useZoomOnTapAndDrag(pluginData, setZoomDataCallback);

  useZoomOnBrush(pluginData, setZoomDataCallback);

  useZoomOnDoubleTapReset(pluginData, setZoomDataCallback);

  const zoom = React.useCallback(
    (step: number) => {
      setZoomDataCallback((prev) =>
        prev.map((zoomData) => {
          const zoomOptions = selectorChartAxisZoomOptionsLookup(store.state, zoomData.axisId);

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
      zoomInteractionConfig: initializeZoomInteractionConfig(
        params.zoomInteractionConfig,
        optionsLookup,
      ),
    },
  };
};
