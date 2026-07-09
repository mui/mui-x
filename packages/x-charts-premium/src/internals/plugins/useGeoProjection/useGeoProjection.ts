'use client';
import * as React from 'react';
import type { ChartPlugin } from '@mui/x-charts/internals';
import type { UseGeoProjectionSignature } from './useGeoProjection.types';

export const useGeoProjection: ChartPlugin<UseGeoProjectionSignature> = ({ params, store }) => {
  const { geoData, geoFeatureKey, projection, parallels } = params;

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
      parallels: parallels ?? null,
    });
  }, [geoData, geoFeatureKey, projection, parallels, store]);

  return {};
};

useGeoProjection.params = {
  geoData: true,
  geoFeatureKey: true,
  projection: true,
  parallels: true,
};

useGeoProjection.getDefaultizedParams = ({ params }) => ({ ...params });

useGeoProjection.getInitialState = (params) => ({
  geoProjection: {
    geoData: params.geoData ?? null,
    geoFeatureKey: params.geoFeatureKey ?? 'name',
    projection: params.projection ?? null,
    parallels: params.parallels ?? null,
  },
});
