import {
  geoAlbers,
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
  geoEqualEarth,
  geoEquirectangular,
  geoGnomonic,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
  geoStereographic,
  geoTransverseMercator,
} from '@mui/x-charts-vendor/d3-geo';
import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import type { D3NamedProjection } from './useGeoProjection.types';

export const PROJECTION_FACTORIES: Record<D3NamedProjection, (() => GeoProjection) | undefined> = {
  // Azimuthal projections (https://d3js.org/d3-geo/azimuthal)
  azimuthalEqualArea: geoAzimuthalEqualArea,
  azimuthalEquidistant: geoAzimuthalEquidistant,
  gnomonic: geoGnomonic,
  orthographic: geoOrthographic,
  stereographic: geoStereographic,

  // Conic projections (https://d3js.org/d3-geo/conic)
  conicConformal: geoConicConformal,
  conicEqualArea: geoConicEqualArea,
  conicEquidistant: geoConicEquidistant,
  albers: geoAlbers,
  albersUsa: geoAlbersUsa, // Special composition for the USA with an edge case for Alaska and Hawaii.

  // Cylindrical projections (https://d3js.org/d3-geo/cylindrical)
  equirectangular: geoEquirectangular,
  mercator: geoMercator,
  transverseMercator: geoTransverseMercator,
  equalEarth: geoEqualEarth,
  naturalEarth1: geoNaturalEarth1,
};
