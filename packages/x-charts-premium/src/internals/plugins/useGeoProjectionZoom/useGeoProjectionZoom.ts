'use client';
import * as React from 'react';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { getDefaultTranslation } from '@mui/x-charts/internals';
import type { ChartPlugin } from '@mui/x-charts/internals';
import { useRegisterZoomGestures } from '@mui/x-charts-pro/internals';
import { selectorChartRawProjection } from '../useGeoProjection/useGeoProjection.selectors';
import type { MapZoomView, UseGeoProjectionZoomSignature } from './useGeoProjectionZoom.types';
import { BUTTON_ZOOM_STEP, getDefaultMapInteraction } from './mapZoom.utils';
import { PROJECTION_FACTORIES } from '../useGeoProjection';
import { usePanOnDrag } from './gestureHooks/usePanOnDrag';
import { useZoomOnWheel } from './gestureHooks/useZoomOnWheel';
import { useZoomOnPinch } from './gestureHooks/useZoomOnPinch';

export const useGeoProjectionZoom: ChartPlugin<UseGeoProjectionZoomSignature> = ({
  store,
  instance,
  params,
}) => {
  const { zoom, onViewChange, view } = params;

  const interactionDefaults = getDefaultMapInteraction(selectorChartRawProjection(store.state));

  const {
    minZoomLevel = 0.5,
    maxZoomLevel = 8,
    maxEmptySpace = 0,
    rotationAllowed = interactionDefaults.rotationAllowed,
    translationAllowed = interactionDefaults.translationAllowed,
  } = typeof zoom === 'object' ? zoom : {};

  // `zoom` is either a boolean or a config object; an object always enables the interaction.
  const enabled = zoom !== false;
  const isControlled = view !== undefined;

  const clampZoomLevel = React.useCallback(
    (zoomLevel: number) => Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel)),
    [minZoomLevel, maxZoomLevel],
  );

  // The view is the source of truth, stored directly: no pixel <-> view conversion on write/read.
  // Callers are responsible for clamping `zoomLevel`.
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
      translation: view.translation,
    });
  }, [store, view]);

  useRegisterZoomGestures({ instance });

  // --- gestures: reuse the generic primitives from x-charts-pro -------------
  usePanOnDrag({ store, instance }, applyView, {
    enabled,
    rotationAllowed,
    translationAllowed,
    maxEmptySpace,
  });
  useZoomOnWheel({ store, instance }, applyView, {
    enabled,
    rotationAllowed,
    translationAllowed,
    maxEmptySpace,
    minZoomLevel,
    maxZoomLevel,
  });
  useZoomOnPinch({ store, instance }, applyView, {
    enabled,
    rotationAllowed,
    translationAllowed,
    maxEmptySpace,
    minZoomLevel,
    maxZoomLevel,
  });

  // Shared by both buttons: clamp through `applyView` (which also handles controlled mode and
  // `onViewChange`), keeping the current center/translation. Bail out when already at a bound so a
  // click at the limit stays a no-op.
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
        translation: current.translation ?? [0, 0],
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
      translation: store.state.geoProjectionZoom.initialTranslation,
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
  const center = params.view?.center ?? params.initialView?.center ?? [0, 0];
  const translation = params.view?.translation ??
    params.initialView?.translation ??
    getDefaultTranslation(
      params.projection,
      PROJECTION_FACTORIES,
      params.geoData,
      params.parallels,
      center,
    ) ?? [0, 0];
  return {
    geoProjectionZoom: {
      zoomLevel,
      center,
      translation,

      initialZoomLevel: zoomLevel,
      initialCenter: center,
      initialTranslation: translation,
    },
  };
};
