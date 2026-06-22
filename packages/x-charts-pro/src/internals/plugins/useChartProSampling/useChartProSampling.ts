'use client';
import * as React from 'react';
import { type ChartPlugin, type SamplingMethod } from '@mui/x-charts/internals';
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
    store.set('sampling', toSamplingState(sampling));
  }, [sampling, store]);

  return {};
};

/** Maps the public `sampling` method to the internal state (`enabled` + line algorithm). */
function toSamplingState(sampling: SamplingMethod) {
  return {
    enabled: sampling !== 'none',
    lineAlgorithm: sampling === 'none' ? ('m4' as const) : sampling,
  };
}

useChartProSampling.params = {
  sampling: true,
};

useChartProSampling.getDefaultizedParams = ({ params }) => ({
  ...params,
  sampling: params.sampling ?? 'none',
});

useChartProSampling.getInitialState = ({ sampling }) => ({
  sampling: toSamplingState(sampling),
});
