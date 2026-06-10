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
  const { geoData, projection, translate, rotate, scale } = params;

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    store.set('geoProjection', {
      geoData: geoData ?? null,
      projection: projection ?? null,
      translate: translate ?? null,
      rotate: rotate ?? null,
      scale: scale ?? null,
      factories: PROJECTION_FACTORIES,
    });
  }, [geoData, projection, translate, rotate, scale, store]);

  return {};
};

useGeoProjection.params = {
  geoData: true,
  projection: true,
  translate: true,
  rotate: true,
  scale: true,
};

useGeoProjection.getDefaultizedParams = ({ params }) => ({ ...params });

useGeoProjection.getInitialState = (params) => ({
  geoProjection: {
    geoData: params.geoData ?? null,
    projection: params.projection ?? null,
    translate: params.translate ?? null,
    rotate: params.rotate ?? null,
    scale: params.scale ?? null,
    factories: PROJECTION_FACTORIES,
  },
});
