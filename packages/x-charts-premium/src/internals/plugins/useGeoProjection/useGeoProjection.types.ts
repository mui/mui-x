import { type ChartPluginSignature } from '@mui/x-charts/internals';
import { type GeoProjection, type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { type UseGeoProjectionZoomSignature } from '../useGeoProjectionZoom/useGeoProjectionZoom.types';

export type D3NamedProjection =
  | 'azimuthalEqualArea'
  | 'azimuthalEquidistant'
  | 'gnomonic'
  | 'orthographic'
  | 'stereographic'
  | 'conicConformal'
  | 'conicEqualArea'
  | 'conicEquidistant'
  | 'albers'
  | 'albersUsa'
  | 'equirectangular'
  | 'mercator'
  | 'transverseMercator'
  | 'equalEarth'
  | 'naturalEarth1';

/**
 * A d3-geo projection accepted by `useGeoProjection`.
 *
 * Either a built-in projection name (e.g. `'mercator'`, `'naturalEarth1'`)
 * or a `GeoProjection` instance returned by a d3-geo factory.
 */
export type GeoProjectionInput = D3NamedProjection | GeoProjection;

export interface UseGeoProjectionParameters {
  /**
   * The GeoJSON `FeatureCollection` whose features will be rendered on the map.
   */
  geoData?: ExtendedFeatureCollection;
  /**
   * The d3-geo projection used to map geographic coordinates to SVG coordinates.
   * Accepts a d3-geo projection name (e.g. `'mercator'`, `'naturalEarth1'`)
   * or a custom `GeoProjection` instance.
   */
  projection?: GeoProjectionInput;
  /**
   * The rotation of the projection, specified as a `[longitude, latitude]` pair in degrees.
   */
  rotate?: [number, number];
}

export type UseGeoProjectionDefaultizedParameters = UseGeoProjectionParameters;

export interface UseGeoProjectionState {
  geoProjection: {
    geoData: ExtendedFeatureCollection | null;
    projection: GeoProjectionInput | null;
    rotate: [number, number] | null;
    /**
     * The two standard parallels used by conic projections, if applicable.
     * Used for projection 'conicConformal', 'conicEqualArea', 'conicEquidistant'.
     */
    parallels?: [number, number] | null;
  };
}

export type UseGeoProjectionSignature = ChartPluginSignature<{
  params: UseGeoProjectionParameters;
  defaultizedParams: UseGeoProjectionDefaultizedParameters;
  state: UseGeoProjectionState;
  // The zoom state (`zoomLevel`/`center`) is owned by `useGeoProjectionZoom`, but the projection
  // selector reads it to derive the projection scale/translation. Optional so the projection still
  // works when the zoom plugin is not registered.
  optionalDependencies: [UseGeoProjectionZoomSignature];
}>;
