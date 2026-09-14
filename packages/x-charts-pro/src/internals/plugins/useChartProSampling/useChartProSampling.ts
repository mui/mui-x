'use client';
import { useEffectAfterFirstRender } from '@mui/x-internals/useEffectAfterFirstRender';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import type { ChartPlugin, SamplingConfig, SamplingState } from '@mui/x-charts/internals';
import type { UseChartProSamplingSignature } from './useChartProSampling.types';

/** Toggles sampling. Pyramids and level selection live in community selectors. */
export const useChartProSampling: ChartPlugin<UseChartProSamplingSignature> = ({
  params,
  store,
}) => {
  const { sampling } = params;

  useEffectAfterFirstRender(() => {
    // Skip the update when unchanged so an inlined `sampling` config (a new object each render, e.g.
    // in composition) doesn't replace the state and force the pyramids to recompute every render.
    const next = toSamplingState(sampling);
    if (!isDeepEqual(store.state.sampling, next)) {
      store.set('sampling', next);
    }
  }, [sampling, store]);

  return {};
};

/** Maps the per-series-type `sampling` config to the internal state (enabled methods per type). */
function toSamplingState(sampling: SamplingConfig = {}): SamplingState {
  const methods: SamplingState['methods'] = {};
  // Iterate generically so a new series type only needs its `sampling` config entry, no edit here.
  (Object.keys(sampling) as (keyof SamplingConfig)[]).forEach((seriesType) => {
    const method = sampling[seriesType];
    if (method && method !== 'none') {
      methods[seriesType] = method;
    }
  });
  return {
    enabled: Object.keys(methods).length > 0,
    methods,
  };
}

useChartProSampling.params = {
  sampling: true,
};

useChartProSampling.getDefaultizedParams = ({ params }) => ({
  ...params,
  sampling: params.sampling ?? {},
});

useChartProSampling.getInitialState = ({ sampling }) => ({
  sampling: toSamplingState(sampling),
});
