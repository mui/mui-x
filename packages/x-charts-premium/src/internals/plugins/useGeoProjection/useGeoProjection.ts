'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseGeoProjectionSignature } from './useGeoProjection.types';

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
  },
});
