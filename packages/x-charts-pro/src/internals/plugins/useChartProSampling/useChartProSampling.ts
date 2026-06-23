'use client';
import * as React from 'react';
import { type ChartPlugin, type SamplingConfig, type SamplingState } from '@mui/x-charts/internals';
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

/** Maps the per-series-type `sampling` config to the internal state (enabled methods per type). */
function toSamplingState(sampling: SamplingConfig = {}): SamplingState {
  const methods: SamplingState['methods'] = {};
  if (sampling.bar && sampling.bar !== 'none') {
    methods.bar = sampling.bar;
  }
  if (sampling.line && sampling.line !== 'none') {
    methods.line = sampling.line;
  }
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
