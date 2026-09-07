'use client';
import type { ChartPlugin } from '@mui/x-charts/internals';
import { useWheelGesture } from '@mui/x-charts-pro/internals';
import type {
  MapRotationAxis,
  MapTranslationAxis,
  MapZoomView,
  UseGeoProjectionZoomSignature,
} from '../useGeoProjectionZoom.types';
import { selectorChartProjection } from '../../useGeoProjection';
import { getRotation, getTranslation, WHEEL_ZOOM_STEP } from '../mapZoom.utils';

export const useZoomOnWheel = (
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

  useWheelGesture(instance, {
    enabled,
    onWheel: (point, event) => {
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

      const rotate = projection.rotate?.();
      const scale = projection.scale();
      const nextRotation = getRotation(
        projection,
        geoPoint,
        [point.x, point.y],
        factor,
        rotationAllowed,
      );
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
