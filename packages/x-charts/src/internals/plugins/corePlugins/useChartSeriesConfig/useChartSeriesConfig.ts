'use client';

import useEventCallback from '@mui/utils/useEventCallback';
import type { ChartSeriesType, SeriesItemIdentifier } from '../../../../models';
import { type ChartPlugin } from '../../models';
import {
  type UseChartSeriesConfigSignature,
  type SerializeIdentifierFunction,
  type CleanIdentifierFunction,
} from './useChartSeriesConfig.types';
import { serializeIdentifier as serializeIdentifierFn } from './utils/serializeIdentifier';
import { cleanIdentifier as cleanIdentifierFn } from './utils/cleanIdentifier';
import type { ChartSeriesConfig } from './types';

export const useChartSeriesConfig: ChartPlugin<UseChartSeriesConfigSignature> = ({ store }) => {
  const serializeIdentifier: SerializeIdentifierFunction = useEventCallback((identifier) =>
    serializeIdentifierFn(store.state.seriesConfig.config, identifier),
  );

  const cleanIdentifier: CleanIdentifierFunction = useEventCallback(
    <T extends { type: ChartSeriesType }>(identifier: T): SeriesItemIdentifier<T['type']> =>
      cleanIdentifierFn<T['type'], T>(store.state.seriesConfig.config, identifier),
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
