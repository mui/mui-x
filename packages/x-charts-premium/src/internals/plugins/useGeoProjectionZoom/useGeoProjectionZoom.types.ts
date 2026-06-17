import { type ChartPluginSignature } from '@mui/x-charts/internals';
import { type UseGeoProjectionSignature } from '../useGeoProjection';
import { type MapZoomView } from './mapZoom.utils';

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
   * The view to apply on mount, when the zoom is not controlled.
   * Use this to seed the map at a specific zoom level and center without controlling it.
   */
  initialView?: MapZoomView;
  /**
   * The view to display, in controlled mode.
   * When set, the component does not update the view on its own — drive it from `onZoomChange`.
   */
  view?: MapZoomView;
  /**
   * Callback fired when the map zoom or pan changes (including programmatic reset).
   * @param {MapZoomView} view The new zoom level and geographic center.
   */
  onZoomChange?: (view: MapZoomView) => void;
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
