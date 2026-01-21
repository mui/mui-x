'use client';

import { defaultSeriesConfig } from './defaultSeriesConfig';
import { type ChartPlugin } from '../../models';
import { type UseSeriesConfigSignature } from './useChartSeriesConfig.types';

export const useSeriesConfig: ChartPlugin<UseSeriesConfigSignature> = () => {
  // The seriesConfig is static and doesn't change after initialization
  // It's stored in the initial state and accessed via selectors
  return {};
};

useSeriesConfig.params = {
  seriesConfig: true,
};

useSeriesConfig.getDefaultizedParams = ({ params }) => ({
  ...params,
  // The default value will be provided by ChartProvider when no seriesConfig is passed
  seriesConfig: params.seriesConfig ?? defaultSeriesConfig,
});

useSeriesConfig.getInitialState = ({ seriesConfig }) => {
  return {
    seriesConfig: {
      config: seriesConfig ?? defaultSeriesConfig,
    },
  };
};
