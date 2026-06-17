'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseGeoProjectionSignature } from './useGeoProjection.types';

export const useGeoProjection: ChartPlugin<UseGeoProjectionSignature> = ({ params, store }) => {
  const { geoData, projection, rotate, zoomLevel, center } = params;

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Preserve the zoom state (`zoomLevel`/`center`) owned by `useGeoProjectionZoom`.
    store.set('geoProjection', {
      ...store.state.geoProjection,
      geoData: geoData ?? null,
      projection: projection ?? null,
      rotate: rotate ?? null,
      zoomLevel: zoomLevel ?? 1,
      center: center ?? [0, 0],
    });
  }, [geoData, projection, rotate, zoomLevel, center, store]);

  return {};
};

useGeoProjection.params = {
  geoData: true,
  projection: true,
  zoomLevel: true,
  center: true,
  rotate: true,
};

useGeoProjection.getDefaultizedParams = ({ params }) => ({ ...params });

useGeoProjection.getInitialState = (params) => ({
  geoProjection: {
    geoData: params.geoData ?? null,
    projection: params.projection ?? null,
    rotate: params.rotate ?? null,
    zoomLevel: null,
    center: null,
  },
});
