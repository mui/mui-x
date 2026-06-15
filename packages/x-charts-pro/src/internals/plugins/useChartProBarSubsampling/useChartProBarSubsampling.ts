'use client';
import * as React from 'react';
import { type ChartPlugin } from '@mui/x-charts/internals';
import { type UseChartProBarSubsamplingSignature } from './useChartProBarSubsampling.types';

/**
 * Controls bar subsampling. The level-of-detail pyramids and the active-level selection live in
 * community selectors (`selectorChartBarSubsamplingPyramids`); this plugin only toggles the
 * feature on/off so those selectors produce data for the bar plot.
 *
 * Demos: none yet — internal performance feature.
 */
export const useChartProBarSubsampling: ChartPlugin<UseChartProBarSubsamplingSignature> = ({
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
    store.set('barSubsampling', { enabled: subsampling, strategy: 'minMaxEnvelope' });
  }, [subsampling, store]);

  return {};
};

useChartProBarSubsampling.params = {
  subsampling: true,
};

useChartProBarSubsampling.getDefaultizedParams = ({ params }) => ({
  ...params,
  subsampling: params.subsampling ?? true,
});

useChartProBarSubsampling.getInitialState = ({ subsampling }) => ({
  barSubsampling: {
    enabled: subsampling,
    strategy: 'minMaxEnvelope',
  },
});
