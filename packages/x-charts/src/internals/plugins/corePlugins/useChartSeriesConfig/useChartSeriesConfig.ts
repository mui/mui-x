'use client';

import { type ChartPlugin } from '../../models';
import { type UseChartSeriesConfigSignature } from './useChartSeriesConfig.types';

export const useChartSeriesConfig: ChartPlugin<UseChartSeriesConfigSignature> = () => {
  // The seriesConfig is static and doesn't change after initialization
  // It's stored in the initial state and accessed via selectors
  return {};
};

useChartSeriesConfig.params = {
  seriesConfig: true,
};

useChartSeriesConfig.getDefaultizedParams = ({ params }) => ({
  ...params,
  // The default value will be provided by ChartProvider when no seriesConfig is passed
  seriesConfig: params.seriesConfig,
});

useChartSeriesConfig.getInitialState = ({ seriesConfig }) => {
  return {
    seriesConfig: {
      config: seriesConfig,
    },
  };
};
