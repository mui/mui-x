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
   * The zoom transform to apply on mount, when the zoom is not controlled.
   * Use this to seed the map with a specific scale/translation without controlling it.
   *
   * Note: `translate` is expressed in SVG pixels and is therefore tied to the current
   * drawing-area size. A value captured at one size may not restore the same view at another.
   */
  initialTransform?: MapZoomTransform;
  /**
   * The zoom transform to apply, in controlled mode.
   * When set, the component does not update the transform on its own — drive it from `onZoomChange`.
   *
   * Note: `translate` is expressed in SVG pixels (see `initialTransform`).
   */
  transform?: MapZoomTransform;
  /**
   * Callback fired when the map zoom or pan changes (including programmatic reset).
   * @param {MapZoomTransform} transform The new projection scale and translation.
   */
  onZoomChange?: (transform: MapZoomTransform) => void;
}

interface UseGeoProjectionZoomDefaultizedParameters extends UseGeoProjectionZoomParameters {
  zoom: boolean;
  minScaleRatio: number;
  maxScaleRatio: number;
}

/**
 * Imperative methods shared by the plugin `instance` and the public `apiRef`.
 */
export interface UseGeoProjectionZoomPublicApi {
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
  resetZoom: () => void;
}

export interface UseGeoProjectionZoomInstance extends UseGeoProjectionZoomPublicApi {}

export type UseGeoProjectionZoomSignature = ChartPluginSignature<{
  params: UseGeoProjectionZoomParameters;
  defaultizedParams: UseGeoProjectionZoomDefaultizedParameters;
  publicAPI: UseGeoProjectionZoomPublicApi;
  instance: UseGeoProjectionZoomInstance;
  dependencies: [UseGeoProjectionSignature];
}>;
