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
import {
  getRotation,
  getTranslation,
  type MapTranslationAxis,
  type MapRotationAxis,
  type MapZoomView,
} from './mapZoom.utils';

/** Multiplicative zoom step applied per wheel tick. */
const WHEEL_ZOOM_STEP = 1.1;
/** Multiplicative zoom step applied per `zoomIn`/`zoomOut` call. */
const BUTTON_ZOOM_STEP = 1.3;

export const useGeoProjectionZoom: ChartPlugin<UseGeoProjectionZoomSignature> = ({
  store,
  instance,
  params,
}) => {
  const { zoom, minScaleRatio, maxScaleRatio, onZoomChange, view } = params;

  // `zoom` is either a boolean or a config object; an object always enables the interaction.
  const enabled = zoom !== false;
  const rotationAllowed: MapRotationAxis =
    typeof zoom === 'object' ? (zoom.rotationAllowed ?? 'both') : 'both';
  const translationAllowed: MapTranslationAxis =
    typeof zoom === 'object' ? (zoom.translationAllowed ?? 'both') : 'both';

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
          translation: newView.translation,
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
      if (!projection) {
        return;
      }
      dragCurrentPoint.current = [
        dragCurrentPoint.current![0] + delta.x,
        dragCurrentPoint.current![1] + delta.y,
      ];
      const center = getRotation(
        projection,
        geoPoint.current!,
        dragCurrentPoint.current!,
        1,
        rotationAllowed,
      );

      const rotate = projection.rotate();
      projection.rotate([-center![0], -center![1]]);
      const translation = getTranslation(
        store,
        projection,
        geoPoint.current!,
        dragCurrentPoint.current!,
        translationAllowed,
      );

      projection.rotate(rotate);

      if (center) {
        applyView({
          zoomLevel: store.state.geoProjectionZoom.zoomLevel ?? 1,
          center,
          translation: translation ?? store.state.geoProjectionZoom.translation ?? [0, 0],
        });
      }
    },
  });

  useWheelGesture(instance, {
    enabled,
    onWheel: (point, event) => {
      const factor = event.deltaY < 0 ? WHEEL_ZOOM_STEP : 1 / WHEEL_ZOOM_STEP;

      const projection = getProjection();
      if (!projection || !projection.invert) {
        return;
      }
      const geoPoint = projection.invert([point.x, point.y]) as [number, number] | null;
      if (!geoPoint) {
        return;
      }
      const center = getRotation(projection, geoPoint, [point.x, point.y], factor, rotationAllowed);

      const rotate = projection.rotate();
      projection.rotate([-center![0], -center![1]]);
      const translation = getTranslation(
        store,
        projection,
        geoPoint,
        [point.x, point.y],
        translationAllowed,
      );
      projection.rotate(rotate);

      if (center) {
        applyView({
          zoomLevel: (store.state.geoProjectionZoom.zoomLevel ?? 1) * factor,
          center,
          translation: translation ?? store.state.geoProjectionZoom.translation ?? [0, 0],
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

      const geoPoint = projection.invert([point.x, point.y]) as [number, number] | null;
      if (!geoPoint) {
        return;
      }
      const center = getRotation(
        projection,
        geoPoint,
        [point.x, point.y],
        1 + deltaScale,
        rotationAllowed,
      );

      const rotate = projection.rotate();
      projection.rotate([-center![0], -center![1]]);
      const translation = getTranslation(
        store,
        projection,
        geoPoint,
        [point.x, point.y],
        translationAllowed,
      );
      projection.rotate(rotate);

      if (center || translation) {
        applyView({
          zoomLevel: (store.state.geoProjectionZoom.zoomLevel ?? 1) * (1 + deltaScale),
          center: center ?? store.state.geoProjectionZoom.center ?? [0, 0],
          translation: translation ?? store.state.geoProjectionZoom.translation ?? [0, 0],
        });
      }
    },
  });

  const zoomIn = React.useCallback(
    (factor = BUTTON_ZOOM_STEP, center?: [number, number]) => {
      const currentZoom = store.state.geoProjectionZoom.zoomLevel ?? 1;
      const nextZoom = Math.max(minScaleRatio, Math.min(maxScaleRatio, currentZoom * factor));
      if (nextZoom === currentZoom) {
        return;
      }
      store.set('geoProjectionZoom', {
        ...store.state.geoProjectionZoom,
        zoomLevel: nextZoom,
        center: center ?? store.state.geoProjectionZoom.center,
      });
    },
    [store, minScaleRatio, maxScaleRatio],
  );

  const zoomOut = React.useCallback(
    (factor = 1 / BUTTON_ZOOM_STEP, center?: [number, number]) => {
      const currentZoom = store.state.geoProjectionZoom.zoomLevel ?? 1;
      const nextZoom = Math.max(minScaleRatio, Math.min(maxScaleRatio, currentZoom * factor));
      if (nextZoom === currentZoom) {
        return;
      }
      store.set('geoProjectionZoom', {
        ...store.state.geoProjectionZoom,
        zoomLevel: nextZoom,
        center: center ?? store.state.geoProjectionZoom.center,
      });
    },
    [store, minScaleRatio, maxScaleRatio],
  );

  const resetZoom = React.useCallback(() => {
    if (!isControlled) {
      store.set('geoProjectionZoom', {
        ...store.state.geoProjectionZoom,
        zoomLevel: 1,
        center: [0, 0],
      });
    }
    // Notify so controlled consumers and listeners learn about the reset (fit view: zoomLevel 1).
    const projection = getProjection();
    const center = projection?.invert?.([drawingAreaCenter().x, drawingAreaCenter().y]);

    if (center) {
      onZoomChange?.({
        zoomLevel: 1,
        center: center as [number, number],
        translation: [0, 0],
      });
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
    translation: params.view?.translation ?? params.initialView?.translation ?? [0, 0],
  },
});
