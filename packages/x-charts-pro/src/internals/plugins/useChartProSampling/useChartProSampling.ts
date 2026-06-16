'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseChartProSamplingSignature } from './useChartProSampling.types';

/** Toggles sampling. Pyramids and level selection live in community selectors. */
export const useChartProSampling: ChartPlugin<UseChartProSamplingSignature> = ({
  params,
  store,
}) => {
  const { sampling } = params;
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    store.set('sampling', { enabled: sampling, strategy: 'minMaxEnvelope' });
  }, [sampling, store]);

  return {};
};

useChartProSampling.params = {
  sampling: true,
};

useChartProSampling.getDefaultizedParams = ({ params }) => ({
  ...params,
  sampling: params.sampling ?? true,
});

useChartProSampling.getInitialState = ({ sampling }) => ({
  sampling: {
    enabled: sampling,
    strategy: 'minMaxEnvelope',
  },
});
