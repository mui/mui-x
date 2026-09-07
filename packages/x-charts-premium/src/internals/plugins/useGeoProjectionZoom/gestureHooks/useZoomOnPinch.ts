'use client';
import type { ChartPlugin } from '@mui/x-charts/internals';
import { usePinchGesture } from '@mui/x-charts-pro/internals';
import type {
  MapRotationAxis,
  MapTranslationAxis,
  MapZoomView,
  UseGeoProjectionZoomSignature,
} from '../useGeoProjectionZoom.types';
import { selectorChartProjection } from '../../useGeoProjection';
import { getRotation, getTranslation } from '../mapZoom.utils';

export const useZoomOnPinch = (
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
    minZoomLevel: number;
    maxZoomLevel: number;
  },
) => {
  const { enabled, rotationAllowed, translationAllowed, maxEmptySpace } = options;
  const projection = store.use(selectorChartProjection);

  const clampZoomLevel = (zoomLevel: number) =>
    Math.max(options.minZoomLevel, Math.min(options.maxZoomLevel, zoomLevel));

  usePinchGesture(instance, {
    enabled,
    onPinch: (point, deltaScale) => {
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
      const nextRotation = getRotation(
        projection,
        geoPoint,
        [point.x, point.y],
        factor,
        rotationAllowed,
      );
      const scale = projection.scale();
      const rotate = projection.rotate?.();
      if (nextRotation) {
        projection.rotate?.([-nextRotation[0], -nextRotation[1], nextRotation[2]]);
      }
      projection.scale(scale * factor);
      const translation = getTranslation(
        store,
        projection,
        geoPoint,
        [point.x, point.y],
        translationAllowed,
        maxEmptySpace,
        store.state.geoProjectionZoom.translation ?? [0, 0],
      );
      projection.rotate?.(rotate);
      projection.scale(scale);

      if (nextRotation || translation) {
        applyView({
          zoomLevel: nextZoom,
          center: nextRotation
            ? [nextRotation[0], nextRotation[1]]
            : (store.state.geoProjectionZoom.center ?? [0, 0]),
          translation: translation ?? store.state.geoProjectionZoom.translation ?? [0, 0],
          roll: nextRotation ? nextRotation[2] : (store.state.geoProjectionZoom.roll ?? 0),
        });
      }
    },
  });
};
