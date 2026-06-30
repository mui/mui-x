import type { GeoProjection, ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import type { ChartPluginSignature } from '../../models/plugin';

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
   * The key, or value getter, used to identify each feature in `geoData`.
   * - If a string is provided, `feature.properties[geoFeatureKey]` will be used.
   * - If a function is provided, it will be called with each feature and should return a key for that feature.
   * @default 'name'
   */
  geoFeatureKey?:
    | string
    | ((feature: ExtendedFeatureCollection['features'][number]) => string | null);
  /**
   * The d3-geo projection used to map geographic coordinates to SVG coordinates.
   * Accepts a d3-geo projection name (e.g. `'mercator'`, `'naturalEarth1'`)
   * or a custom `GeoProjection` instance.
   */
  projection?: GeoProjectionInput;
  /**
   * The center of the projection, specified as a `[longitude, latitude]` pair in degrees.
   */
  translate?: [number, number];
  /**
   * The rotation of the projection, specified as a `[longitude, latitude]` pair in degrees.
   */
  rotate?: [number, number];
  /**
   * The scale of the projection.
   * If not provided, the scale will default to fit the entire geoData in the drawing area.
   */
  scale?: number;
}

export type UseGeoProjectionDefaultizedParameters = UseGeoProjectionParameters;

export interface UseGeoProjectionState {
  geoProjection: {
    geoData: ExtendedFeatureCollection | null;
    geoFeatureKey:
      | string
      | ((feature: ExtendedFeatureCollection['features'][number]) => string | null);
    projection: GeoProjectionInput | null;
    translate: [number, number] | null;
    rotate: [number, number] | null;
    scale: number | null;
    // TODO: Remove factories from the state when some maps move to MIT package.
    factories: Record<D3NamedProjection, (() => GeoProjection) | undefined>;
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
}>;
