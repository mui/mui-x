'use client';
import * as React from 'react';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { getDefaultCenter } from '@mui/x-charts/internals';
import type { ChartPlugin } from '@mui/x-charts/internals';
import {
  useDragGesture,
  useWheelGesture,
  usePinchGesture,
  useRegisterZoomGestures,
} from '@mui/x-charts-pro/internals';
import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import {
  selectorChartProjection,
  selectorChartRawProjection,
} from '../useGeoProjection/useGeoProjection.selectors';
import type { MapZoomView, UseGeoProjectionZoomSignature } from './useGeoProjectionZoom.types';
import { getDefaultMapInteraction, getGestureCenter } from './mapZoom.utils';
import { PROJECTION_FACTORIES } from '../useGeoProjection';

/** Multiplicative zoom step applied per wheel tick. */
const WHEEL_ZOOM_STEP = 1.1;
/** Multiplicative zoom step applied per `zoomIn`/`zoomOut` call. */
const BUTTON_ZOOM_STEP = 1.3;

export const useGeoProjectionZoom: ChartPlugin<UseGeoProjectionZoomSignature> = ({
  store,
  instance,
  params,
}) => {
  const { zoom, onViewChange, view } = params;


  const {
    minZoomLevel = 0.5,
    maxZoomLevel = 8,

  } = typeof zoom === 'object' ? zoom : {};

  // `zoom` is either a boolean or a config object; an object always enables the interaction.
  const enabled = zoom !== false;
  const isControlled = view !== undefined;

  const getProjection = React.useCallback(
    (): GeoProjection | null => selectorChartProjection(store.state),
    [store],
  );

  const clampZoomLevel = React.useCallback(
    (zoomLevel: number) => Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel)),
    [minZoomLevel, maxZoomLevel],
  );

  // The view is the source of truth, stored directly: no pixel <-> view conversion on write/read.
  // Callers are responsible for clamping `zoomLevel` (via `clampZoomLevel`) before applying it.
  const applyView = React.useCallback(
    (newView: MapZoomView) => {
      console.log(JSON.stringify(newView));
      if (!newView.center.every(Number.isFinite)) {
        return;
      }

      if (!isControlled) {
        store.set('geoProjectionZoom', {
          ...store.state.geoProjectionZoom,
          zoomLevel: newView.zoomLevel,
          center: newView.center,
        });
      }
      onViewChange?.(newView);
    },
    [store, isControlled, onViewChange],
  );

  // In controlled mode, keep the store in sync with the `view` prop. The initial view is seeded in
  // `getInitialState`, so this only reacts to subsequent updates.
  useEffectAfterFirstRender(() => {
    if (!view) {
      return;
    }

    store.set('geoProjectionZoom', {
      ...store.state.geoProjectionZoom,
      zoomLevel: view.zoomLevel,
      center: view.center,
    });
  }, [store, view]);

  useRegisterZoomGestures({ instance });

  const geoPoint = React.useRef<[number, number] | null>(null);
  const dragStartPoint = React.useRef<[number, number] | null>(null);
  const dragCurrentPoint = React.useRef<[number, number] | null>(null);

  // --- gestures: reuse the generic primitives from x-charts-pro -------------
  useDragGesture(instance, {
    enabled,
    onPanStart: (event) => {
      const projection = getProjection();
      if (!projection || !projection.invert) {
        return;
      }
      geoPoint.current = projection.invert([
        event.detail.srcEvent.offsetX,
        event.detail.srcEvent.offsetY,
      ]) as [number, number] | null;
      dragStartPoint.current = [event.detail.srcEvent.offsetX, event.detail.srcEvent.offsetY];
      dragCurrentPoint.current = [event.detail.srcEvent.offsetX, event.detail.srcEvent.offsetY];
    },
    onPanEnd: () => {
      geoPoint.current = null;
      dragStartPoint.current = null;
      dragCurrentPoint.current = null;
    },
    onPan: (delta) => {
      const projection = getProjection();
      if (!projection || dragCurrentPoint.current === null || geoPoint.current === null) {
        return;
      }
      dragCurrentPoint.current = [
        dragCurrentPoint.current[0] + delta.x,
        dragCurrentPoint.current[1] + delta.y,
      ];

      const center = getGestureCenter(
        store,
        projection,
        geoPoint.current,
        dragCurrentPoint.current,
        1,
      );

      if (center) {
        applyView({
          zoomLevel: store.state.geoProjectionZoom.zoomLevel ?? 1,
          center,
        });
      }
    },
  });

  useWheelGesture(instance, {
    enabled,
    onWheel: (point, event) => {
      const projection = getProjection();
      if (!projection || !projection.invert) {
        return;
      }

      // Clamp the target zoom first, then derive the factor actually applied. At the bounds the
      // factor collapses to `1`, so wheeling further neither scales nor shifts the map.
      const currentZoom = store.state.geoProjectionZoom.zoomLevel ?? 1;
      const rawFactor = event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
      const nextZoom = clampZoomLevel(currentZoom * rawFactor);
      const factor = nextZoom / currentZoom;
      if (factor === 1) {
        return;
      }

      const geoPoint = projection.invert([point.x, point.y]) as [number, number] | null;
      if (!geoPoint) {
        return;
      }

      const center = getGestureCenter(
        store,
        projection,
        geoPoint,
        [point.x, point.y],
        factor,
      );

      if (center) {
        applyView({
          zoomLevel: nextZoom,
          center,
        });
      }
    },
  });

  usePinchGesture(instance, {
    enabled,
    onPinch: (point, deltaScale) => {
      const projection = getProjection();
      if (!projection || !projection.invert) {
        return;
      }

      // Same clamp-then-derive-factor flow as the wheel, so pinch obeys the identical bounds.
      const currentZoom = store.state.geoProjectionZoom.zoomLevel ?? 1;
      const nextZoom = clampZoomLevel(currentZoom * (1 + deltaScale));
      const factor = nextZoom / currentZoom;
      if (factor === 1) {
        return;
      }

      const geoPoint = projection.invert([point.x, point.y]) as [number, number] | null;
      if (!geoPoint) {
        return;
      }

      const center = getGestureCenter(
        store,
        projection,
        geoPoint,
        [point.x, point.y],
        factor,
      );

      if (center) {
        applyView({
          zoomLevel: nextZoom,
          center,
        });
      }
    },
  });

  // Shared by both buttons: clamp through `applyView` (which also handles controlled mode and
  // `onViewChange`), keeping the current center. Bail out when already at a bound so a click at the
  // limit stays a no-op.
  const zoomBy = React.useCallback(
    (factor: number) => {
      const current = store.state.geoProjectionZoom;
      const currentZoom = current.zoomLevel ?? 1;
      const nextZoom = clampZoomLevel(currentZoom * factor);
      if (nextZoom === currentZoom) {
        return;
      }
      applyView({
        zoomLevel: nextZoom,
        center: current.center ?? [0, 0],
      });
    },
    [store, clampZoomLevel, applyView],
  );

  const zoomIn = React.useCallback(() => zoomBy(BUTTON_ZOOM_STEP), [zoomBy]);

  const zoomOut = React.useCallback(() => zoomBy(1 / BUTTON_ZOOM_STEP), [zoomBy]);

  const resetZoom = React.useCallback(() => {
    applyView({
      zoomLevel: store.state.geoProjectionZoom.initialZoomLevel,
      center: store.state.geoProjectionZoom.initialCenter,
    });
  }, [applyView, store]);

  const publicAPI = { zoomIn, zoomOut, resetZoom };

  return {
    publicAPI,
    instance: publicAPI,
  };
};

useGeoProjectionZoom.params = {
  zoom: true,
  initialView: true,
  view: true,
  onViewChange: true,
};

useGeoProjectionZoom.getDefaultizedParams = ({ params }) => ({
  ...params,
  zoom: params.zoom ?? false,
});

useGeoProjectionZoom.getInitialState = (params) => {
  const zoomLevel = params.view?.zoomLevel ?? params.initialView?.zoomLevel ?? 1;
  // When no center is provided, default to the one that keeps the data centered in the drawing area.
  const center = params.view?.center ??
    params.initialView?.center ??
    getDefaultCenter(params.projection, PROJECTION_FACTORIES, params.geoData, params.parallels) ?? [
      0, 0,
    ];
  return {
    geoProjectionZoom: {
      zoomLevel,
      center,

      initialZoomLevel: zoomLevel,
      initialCenter: center,
    },
  };
};
