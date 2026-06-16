'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseChartProSubsamplingSignature } from './useChartProSubsampling.types';

/** Toggles subsampling. Pyramids and level selection live in community selectors. */
export const useChartProSubsampling: ChartPlugin<UseChartProSubsamplingSignature> = ({
  params,
  store,
}) => {
  const { subsampling } = params;
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    store.set('subsampling', { enabled: subsampling, strategy: 'minMaxEnvelope' });
  }, [subsampling, store]);

  return {};
};

useChartProSubsampling.params = {
  subsampling: true,
};

useChartProSubsampling.getDefaultizedParams = ({ params }) => ({
  ...params,
  subsampling: params.subsampling ?? true,
});

useChartProSubsampling.getInitialState = ({ subsampling }) => ({
  subsampling: {
    enabled: subsampling,
    strategy: 'minMaxEnvelope',
  },
});
