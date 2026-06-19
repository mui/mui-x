'use client';
import * as React from 'react';
import type { useGeoProjectionTypes, ChartPlugin } from '@mui/x-charts/internals';
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
  type GeoProjection,
} from '@mui/x-charts-vendor/d3-geo';
import { type UseGeoProjectionSignature } from './useGeoProjection.types';

const PROJECTION_FACTORIES: Record<
  useGeoProjectionTypes.D3NamedProjection,
  (() => GeoProjection) | undefined
> = {
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

export const useGeoProjection: ChartPlugin<UseGeoProjectionSignature> = ({ params, store }) => {
  const { geoData, geoFeatureKey, projection } = params;

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    store.set('geoProjection', {
      ...store.state.geoProjection,
      geoData: geoData ?? null,
      geoFeatureKey: geoFeatureKey ?? 'name',
      projection: projection ?? null,
    });
  }, [geoData, geoFeatureKey, projection, store]);

  return {};
};

useGeoProjection.params = {
  geoData: true,
  geoFeatureKey: true,
  projection: true,
};

useGeoProjection.getDefaultizedParams = ({ params }) => ({ ...params });

useGeoProjection.getInitialState = (params) => ({
  geoProjection: {
    geoData: params.geoData ?? null,
    geoFeatureKey: params.geoFeatureKey ?? 'name',
    projection: params.projection ?? null,
    factories: PROJECTION_FACTORIES,
  },
});
