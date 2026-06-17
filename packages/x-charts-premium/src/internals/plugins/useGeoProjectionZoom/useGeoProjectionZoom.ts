'use client';
import * as React from 'react';
import { type ChartPlugin, selectorChartDrawingArea } from '@mui/x-charts/internals';
import { useDragGesture, useWheelGesture, usePinchGesture } from '@mui/x-charts-pro/internals';
import { type GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { selectorChartProjection } from '../useGeoProjection/useGeoProjection.selectors';
import { type UseGeoProjectionZoomSignature } from './useGeoProjectionZoom.types';
import { panProjection, zoomProjectionAtPoint, type MapZoomTransform } from './mapZoom.utils';

/** Multiplicative zoom step applied per wheel tick. */
const WHEEL_ZOOM_STEP = 1.1;
/** Multiplicative zoom step applied per `zoomIn`/`zoomOut` call. */
const BUTTON_ZOOM_STEP = 1.3;

export const useGeoProjectionZoom: ChartPlugin<UseGeoProjectionZoomSignature> = ({
  store,
  instance,
  params,
}) => {
  const { zoom: enabled, minScaleRatio, maxScaleRatio, onZoomChange } = params;

  // The scale that fits the data in the drawing area. Captured lazily on first
  // interaction and used as the reference for the min/max zoom clamp.
  const fitScaleRef = React.useRef<number | null>(null);

  const getProjection = React.useCallback(
    (): GeoProjection | null => selectorChartProjection(store.state),
    [store],
  );

  const applyTransform = React.useCallback(
    (transform: MapZoomTransform) => {
      store.set('geoProjection', {
        ...store.state.geoProjection,
        scale: transform.scale,
        translate: transform.translate,
      });
      onZoomChange?.(transform);
    },
    [store, onZoomChange],
  );

  const zoomAtPoint = React.useCallback(
    (factor: number, focal: { x: number; y: number }) => {
      const projection = getProjection();
      if (!projection) {
        return;
      }
      if (fitScaleRef.current === null) {
        fitScaleRef.current = projection.scale();
      }
      applyTransform(
        zoomProjectionAtPoint(
          projection,
          factor,
          focal,
          fitScaleRef.current * minScaleRatio,
          fitScaleRef.current * maxScaleRatio,
        ),
      );
    },
    [getProjection, applyTransform, minScaleRatio, maxScaleRatio],
  );

  const drawingAreaCenter = React.useCallback(() => {
    const { left, top, width, height } = selectorChartDrawingArea(store.state);
    return { x: left + width / 2, y: top + height / 2 };
  }, [store]);

  // --- gestures: reuse the generic primitives from x-charts-pro -------------
  useDragGesture(instance, {
    enabled,
    onPan: (delta) => {
      const projection = getProjection();
      if (!projection) {
        return;
      }
      applyTransform(panProjection(projection, delta.x, delta.y));
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

  return {
    instance: {
      zoomIn: () => zoomAtPoint(BUTTON_ZOOM_STEP, drawingAreaCenter()),
      zoomOut: () => zoomAtPoint(1 / BUTTON_ZOOM_STEP, drawingAreaCenter()),
      resetMapZoom: () => {
        fitScaleRef.current = null;
        store.set('geoProjection', {
          ...store.state.geoProjection,
          scale: null,
          translate: null,
        });
      },
    },
  };
};

useGeoProjectionZoom.params = {
  zoom: true,
  minScaleRatio: true,
  maxScaleRatio: true,
  onZoomChange: true,
};

useGeoProjectionZoom.getDefaultizedParams = ({ params }) => ({
  ...params,
  zoom: params.zoom ?? false,
  minScaleRatio: params.minScaleRatio ?? 1,
  maxScaleRatio: params.maxScaleRatio ?? 8,
});

useGeoProjectionZoom.getInitialState = () => ({});
