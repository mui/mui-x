'use client';
import * as React from 'react';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { type ChartPlugin, selectorChartDrawingArea } from '@mui/x-charts/internals';
import {
  useDragGesture,
  useWheelGesture,
  usePinchGesture,
  useRegisterZoomGestures,
} from '@mui/x-charts-pro/internals';
import { type GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { selectorChartProjection } from '../useGeoProjection/useGeoProjection.selectors';
import { type UseGeoProjectionZoomSignature } from './useGeoProjectionZoom.types';
import { centerAfterPan, centerAfterZoom, type MapZoomView } from './mapZoom.utils';

/** Multiplicative zoom step applied per wheel tick. */
const WHEEL_ZOOM_STEP = 1.1;
/** Multiplicative zoom step applied per `zoomIn`/`zoomOut` call. */
const BUTTON_ZOOM_STEP = 1.3;

export const useGeoProjectionZoom: ChartPlugin<UseGeoProjectionZoomSignature> = ({
  store,
  instance,
  params,
}) => {
  const { zoom: enabled, minScaleRatio, maxScaleRatio, onZoomChange, view } = params;

  const isControlled = view !== undefined;

  const getProjection = React.useCallback(
    (): GeoProjection | null => selectorChartProjection(store.state),
    [store],
  );

  const drawingAreaCenter = React.useCallback(() => {
    const { left, top, width, height } = selectorChartDrawingArea(store.state);
    return { x: left + width / 2, y: top + height / 2 };
  }, [store]);

  // The view is the source of truth, stored directly: no pixel <-> view conversion on write/read.
  const applyView = React.useCallback(
    (newView: MapZoomView) => {
      if (!isControlled) {
        store.set('geoProjectionZoom', {
          ...store.state.geoProjectionZoom,
          zoomLevel: newView.zoomLevel,
          center: newView.center,
        });
      }
      onZoomChange?.(newView);
    },
    [store, isControlled, onZoomChange],
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

  // Zoom about a focal point (in SVG pixels). `zoomLevel` is clamped directly — no fit scale.
  const zoomAtPoint = React.useCallback(
    (factor: number, focal: { x: number; y: number }) => {
      const projection = getProjection();
      if (!projection) {
        return;
      }
      const currentZoom = store.state.geoProjectionZoom.zoomLevel ?? 1;
      const nextZoom = Math.max(minScaleRatio, Math.min(maxScaleRatio, currentZoom * factor));
      if (nextZoom === currentZoom) {
        return;
      }
      const center = centerAfterZoom(
        projection,
        nextZoom / currentZoom,
        focal,
        drawingAreaCenter(),
      );
      if (center) {
        applyView({ zoomLevel: nextZoom, center });
      }
    },
    [getProjection, store, applyView, drawingAreaCenter, minScaleRatio, maxScaleRatio],
  );

  useRegisterZoomGestures({ instance });

  // --- gestures: reuse the generic primitives from x-charts-pro -------------
  useDragGesture(instance, {
    enabled,
    onPan: (delta) => {
      const projection = getProjection();
      if (!projection) {
        return;
      }
      const center = centerAfterPan(projection, delta.x, delta.y, drawingAreaCenter());
      if (center) {
        applyView({ zoomLevel: store.state.geoProjectionZoom.zoomLevel ?? 1, center });
      }
    },
  });

  useWheelGesture(instance, {
    enabled,
    onWheel: (point, event) => {
      const factor = event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;
      zoomAtPoint(factor, point);
    },
  });

  usePinchGesture(instance, {
    enabled,
    onPinch: (point, deltaScale) => {
      zoomAtPoint(1 + deltaScale, point);
    },
  });

  const zoomIn = React.useCallback(
    () => zoomAtPoint(BUTTON_ZOOM_STEP, drawingAreaCenter()),
    [zoomAtPoint, drawingAreaCenter],
  );
  const zoomOut = React.useCallback(
    () => zoomAtPoint(1 / BUTTON_ZOOM_STEP, drawingAreaCenter()),
    [zoomAtPoint, drawingAreaCenter],
  );
  const resetZoom = React.useCallback(() => {
    if (!isControlled) {
      store.set('geoProjectionZoom', {
        ...store.state.geoProjectionZoom,
        zoomLevel: null,
        center: null,
      });
    }
    // Notify so controlled consumers and listeners learn about the reset (fit view: zoomLevel 1).
    const projection = getProjection();
    const center = projection?.invert?.([drawingAreaCenter().x, drawingAreaCenter().y]);
    if (center) {
      onZoomChange?.({ zoomLevel: 1, center: center as [number, number] });
    }
  }, [store, isControlled, getProjection, drawingAreaCenter, onZoomChange]);

  const publicAPI = { zoomIn, zoomOut, resetZoom };

  return {
    publicAPI,
    instance: publicAPI,
  };
};

useGeoProjectionZoom.params = {
  zoom: true,
  minScaleRatio: true,
  maxScaleRatio: true,
  initialView: true,
  view: true,
  onZoomChange: true,
};

useGeoProjectionZoom.getDefaultizedParams = ({ params }) => ({
  ...params,
  zoom: params.zoom ?? false,
  minScaleRatio: params.minScaleRatio ?? 1,
  maxScaleRatio: params.maxScaleRatio ?? 8,
});

useGeoProjectionZoom.getInitialState = (params) => ({
  geoProjectionZoom: {
    zoomLevel: params.view?.zoomLevel ?? params.initialView?.zoomLevel ?? 1,
    center: params.view?.center ?? params.initialView?.center ?? [0, 0],
  },
});
