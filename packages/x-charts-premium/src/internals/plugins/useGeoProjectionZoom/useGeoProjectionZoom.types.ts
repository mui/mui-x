import { type ChartPluginSignature } from '@mui/x-charts/internals';
import { type UseGeoProjectionSignature } from '../useGeoProjection';
import { type MapZoomTransform } from './mapZoom.utils';

export interface UseGeoProjectionZoomParameters {
  /**
   * If `true`, the map can be panned (drag) and zoomed (wheel / pinch).
   * @default false
   */
  zoom?: boolean;
  /**
   * The minimum zoom level, as a multiple of the scale that fits the data in the drawing area.
   * @default 1
   */
  minScaleRatio?: number;
  /**
   * The maximum zoom level, as a multiple of the scale that fits the data in the drawing area.
   * @default 8
   */
  maxScaleRatio?: number;
  /**
   * Callback fired when the map zoom or pan changes.
   * @param {MapZoomTransform} transform The new projection scale and translation.
   */
  onZoomChange?: (transform: MapZoomTransform) => void;
}

interface UseGeoProjectionZoomDefaultizedParameters extends UseGeoProjectionZoomParameters {
  zoom: boolean;
  minScaleRatio: number;
  maxScaleRatio: number;
}

export interface UseGeoProjectionZoomInstance {
  /**
   * Zoom the map in by a fixed step, centered on the drawing area.
   */
  zoomIn: () => void;
  /**
   * Zoom the map out by a fixed step, centered on the drawing area.
   */
  zoomOut: () => void;
  /**
   * Reset the map to the default scale and translation that fit the data in the drawing area.
   */
  resetMapZoom: () => void;
}

export type UseGeoProjectionZoomSignature = ChartPluginSignature<{
  params: UseGeoProjectionZoomParameters;
  defaultizedParams: UseGeoProjectionZoomDefaultizedParameters;
  instance: UseGeoProjectionZoomInstance;
  dependencies: [UseGeoProjectionSignature];
}>;
