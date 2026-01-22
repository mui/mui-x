'use client';

import useEventCallback from '@mui/utils/useEventCallback';
import { type ChartPlugin, type ChartSeriesConfig } from '../../models';
import {
  type UseChartSeriesConfigSignature,
  type SerializeIdentifierFunction,
  type CleanIdentifierFunction,
} from './useChartSeriesConfig.types';
import { serializeIdentifier as serializeIdentifierFn } from './serializeIdentifier';
import { cleanIdentifier as cleanIdentifierFn } from './cleanIdentifier';

export const useChartSeriesConfig: ChartPlugin<UseChartSeriesConfigSignature> = ({ store }) => {
  const serializeIdentifier: SerializeIdentifierFunction = useEventCallback((identifier) =>
    serializeIdentifierFn(store.state.seriesConfig.config, identifier),
  );

  const cleanIdentifier: CleanIdentifierFunction = useEventCallback((identifier) =>
    cleanIdentifierFn(store.state.seriesConfig.config, identifier),
  );

  return {
    instance: {
      serializeIdentifier,
      cleanIdentifier,
    },
  };
};

useChartSeriesConfig.params = {
  seriesConfig: true,
};

useChartSeriesConfig.getDefaultizedParams = ({ params }) => ({
  ...params,
  seriesConfig: params.seriesConfig ?? ({} as ChartSeriesConfig<any>),
});

useChartSeriesConfig.getInitialState = ({ seriesConfig }) => {
  return {
    seriesConfig: {
      config: seriesConfig,
    },
  };
};
