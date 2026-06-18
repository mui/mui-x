'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseGeoProjectionSignature } from './useGeoProjection.types';

export const useGeoProjection: ChartPlugin<UseGeoProjectionSignature> = ({ params, store }) => {
  const { geoData, projection, rotate } = params;

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    store.set('geoProjection', {
      ...store.state.geoProjection,
      geoData: geoData ?? null,
      projection: projection ?? null,
      rotate: rotate ?? null,
    });
  }, [geoData, projection, rotate, store]);

  return {};
};

useGeoProjection.params = {
  geoData: true,
  projection: true,
  rotate: true,
};

useGeoProjection.getDefaultizedParams = ({ params }) => ({ ...params });

useGeoProjection.getInitialState = (params) => ({
  geoProjection: {
    geoData: params.geoData ?? null,
    projection: params.projection ?? null,
    rotate: params.rotate ?? null,
  },
});
