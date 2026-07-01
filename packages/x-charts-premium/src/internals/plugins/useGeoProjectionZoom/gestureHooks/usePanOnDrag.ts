'use client';
import * as React from 'react';
import type { ChartPlugin } from '@mui/x-charts/internals';
import { useDragGesture } from '@mui/x-charts-pro/internals';
import type {
  MapRotationAxis,
  MapTranslationAxis,
  MapZoomView,
  UseGeoProjectionZoomSignature,
} from '../useGeoProjectionZoom.types';
import { selectorChartProjection } from '../../useGeoProjection';
import { getRotation, getTranslation } from '../mapZoom.utils';

export const usePanOnDrag = (
  {
    store,
    instance,
  }: Pick<Parameters<ChartPlugin<UseGeoProjectionZoomSignature>>[0], 'store' | 'instance'>,
  applyView: (newView: MapZoomView) => void,
  options: {
    enabled: boolean;
    rotationAllowed: MapRotationAxis;
    translationAllowed: MapTranslationAxis;
    maxEmptySpace: number;
  },
) => {
  const { enabled, rotationAllowed, translationAllowed, maxEmptySpace } = options;
  const projection = store.use(selectorChartProjection);

  const geoPoint = React.useRef<[number, number] | null>(null);
  const dragStartPoint = React.useRef<[number, number] | null>(null);
  const dragCurrentPoint = React.useRef<[number, number] | null>(null);

  useDragGesture(instance, {
    enabled,
    onPanStart: (event) => {
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
      if (!projection || dragCurrentPoint.current === null || geoPoint.current === null) {
        return;
      }
      dragCurrentPoint.current = [
        dragCurrentPoint.current[0] + delta.x,
        dragCurrentPoint.current[1] + delta.y,
      ];
      const center = getRotation(
        projection,
        geoPoint.current,
        dragCurrentPoint.current,
        1,
        rotationAllowed,
      );

      const rotate = projection.rotate?.();
      if (center) {
        projection.rotate?.([-center[0], -center[1]]);
      }
      const translation = getTranslation(
        store,
        projection,
        geoPoint.current,
        dragCurrentPoint.current,
        translationAllowed,
        maxEmptySpace,
      );

      projection.rotate?.(rotate);

      if (center || translation) {
        applyView({
          zoomLevel: store.state.geoProjectionZoom.zoomLevel ?? 1,
          center: center ?? store.state.geoProjectionZoom.center ?? [0, 0],
          translation: translation ?? store.state.geoProjectionZoom.translation ?? [0, 0],
        });
      }
    },
  });
};
