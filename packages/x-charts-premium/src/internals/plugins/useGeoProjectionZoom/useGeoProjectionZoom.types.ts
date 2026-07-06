import type { ChartPluginSignature } from '@mui/x-charts/internals';
import type { UseGeoProjectionSignature } from '../useGeoProjection/useGeoProjection.types';

/**
 * Which rotation axes a pan/zoom gesture may move:
 * - `'both'`: rotate freely along longitude and latitude, keeping the roll fixed.
 * - `'longitude'`: rotate along longitude only (lock the north–south tilt).
 * - `'none'`: lock every axis.
 * - `'both+roll'`: rotate freely along longitude and latitude, and allow rolling the map around the center.
 */
export type MapRotationAxis = 'both' | 'longitude' | 'none' | 'both+roll';

export type MapTranslationAxis = 'both' | 'x' | 'y' | 'none';

/**
 * Public, resolution-independent representation of the map view.
 *
 * Unlike the raw projection `scale`/`translate` (both in SVG pixels, tied to the drawing-area
 * size), a view survives a resize: `zoomLevel` is a ratio and `center` is a geographic coordinate.
 */
export interface MapZoomView {
  /**
   * The zoom level, as a multiple of the scale that fits the data in the drawing area.
   * `1` means the whole dataset fits the drawing area; `2` means twice as close.
   */
  zoomLevel: number;
  /**
   * The geographic coordinate `[longitude, latitude]` displayed at the center of the drawing area.
   */
  center: [number, number];
  /**
   * The map translation in percentage of the drawing area.
   */
  translation: [number, number];
  /**
   * The roll of the map, in degrees.
   * This spins the map around the point displayed at the center of the drawing area, independently
   * of the `center` (which controls longitude/latitude).
   */
  roll: number;
}
/**
 * Fine-grained configuration for the map zoom/pan interaction, passed as the `zoom` parameter
 * instead of a plain `true`.
 */
export interface MapZoomOptions {
  /**
   * Which axes the map can be rotated along while panning or zooming.
   * For example, `'longitude'` lets the map rotate east–west but locks the north–south tilt.
   */
  rotationAllowed?: MapRotationAxis;
  /**
   * Which axes the map can be translated along while panning or zooming.
   * For example, `'y'` lets the map translate vertically but locks the horizontal movement.
   */
  translationAllowed?: MapTranslationAxis;
  /**
   * The minimum zoom level, as a multiple of the scale that fits the data in the drawing area.
   * @default 1
   */
  minZoomLevel?: number;
  /**
   * The maximum zoom level, as a multiple of the scale that fits the data in the drawing area.
   * @default 8
   */
  maxZoomLevel?: number;
  /**
   * The maximal space left empty while panning, expressed as a ratio of the drawing area size.
   * For example:
   * - `0` keeps the map's bounding box flush with (or covering) the drawing area.
   * - `0.5` lets the user pan until at most half of the drawing area is empty on a given side.
   * @default 0
   */
  maxEmptySpace?: number;
}

interface UseGeoProjectionZoomParameters {
  /**
   * If `true`, the map can be panned (drag) and zoomed (wheel / pinch).
   * Pass a {@link MapZoomOptions} object to fine-tune the interaction, e.g. restrict rotation axes.
   * @default false
   */
  zoom?: boolean | MapZoomOptions;
  /**
   * The view to apply on mount, when the zoom is not controlled.
   * Use this to seed the map at a specific zoom level and center without controlling it.
   */
  initialView?: Omit<MapZoomView, 'translation' | 'roll'> &
  Partial<Pick<MapZoomView, 'translation' | 'roll'>>;
  /**
   * The view to display, in controlled mode.
   * When set, the component does not update the view on its own — drive it from `onViewChange`.
   */
  view?: MapZoomView;
  /**
   * Callback fired when the map zoom or pan changes (including programmatic reset).
   * @param {MapZoomView} view The new zoom level and geographic center.
   */
  onViewChange?: (view: MapZoomView) => void;
}

interface UseGeoProjectionZoomDefaultizedParameters extends UseGeoProjectionZoomParameters {
  zoom: boolean | MapZoomOptions;
}

/**
 * Imperative methods shared by the plugin `instance` and the public `apiRef`.
 */
interface UseGeoProjectionZoomPublicApi {
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

interface UseGeoProjectionZoomInstance extends UseGeoProjectionZoomPublicApi { }

export interface UseGeoProjectionZoomState {
  geoProjectionZoom: {
    /**
     * The zoom level, as a multiple of the scale that fits the data in the drawing area.
     * `null` (the default) and `1` both mean fit-to-data. The absolute projection scale is
     * derived as `fitScale * zoomLevel`, so this stays valid across resizes.
     */
    zoomLevel: number;
    /**
     * The geographic coordinate `[longitude, latitude]` displayed at the center of the drawing area.
     * `null` keeps the data centered (the fit center).
     */
    center: [number, number];
    /**
     * The map translation in percentage of the drawing area.
     */
    translation: [number, number] | null;
    /**
     * The roll of the map, in degrees. `null` keeps the map upright (no roll).
     */
    roll: number;
    initialTranslation: [number, number];
    initialCenter: [number, number];
    initialZoomLevel: number;
    initialRoll: number;
  };
}
export type UseGeoProjectionZoomSignature = ChartPluginSignature<{
  params: UseGeoProjectionZoomParameters;
  defaultizedParams: UseGeoProjectionZoomDefaultizedParameters;
  publicAPI: UseGeoProjectionZoomPublicApi;
  instance: UseGeoProjectionZoomInstance;
  state: UseGeoProjectionZoomState;
  dependencies: [UseGeoProjectionSignature];
}>;
