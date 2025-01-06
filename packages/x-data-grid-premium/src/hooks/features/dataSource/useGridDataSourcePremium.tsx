import * as React from 'react';
import {
  useGridApiEventHandler as addEventHandler,
  useGridApiMethod,
  GridEventLookup,
  GRID_ROOT_GROUP_ID,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import {
  useGridDataSourceBase,
  useGridRegisterStrategyProcessor,
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid-pro/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  GridDataSourcePremiumPrivateApi,
  GridGetRowsParamsPremium,
  GridGetRowsResponsePremium,
} from './models';
import { getKeyPremium } from './cache';

const options = {
  cacheOptions: {
    getKey: getKeyPremium,
  },
};

export const useGridDataSourcePremium = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProcessedProps,
) => {
  const { api, strategyProcessor, events } = useGridDataSourceBase<GridPrivateApiPremium>(
    apiRef,
    props,
    options,
  );
  const aggregateRowRef = React.useRef<GridValidRowModel>({});

  const processDataSourceRows = React.useCallback<GridPipeProcessor<'processDataSourceRows'>>(
    (
      {
        params,
        response,
      }: {
        params: GridGetRowsParamsPremium;
        response: GridGetRowsResponsePremium;
      },
      applyRowHydration: boolean,
    ) => {
      if (response.aggregateRow) {
        aggregateRowRef.current = response.aggregateRow;
      }
      if (Object.keys(params.aggregationModel || {}).length > 0) {
        if (applyRowHydration) {
          apiRef.current.requestPipeProcessorsApplication('hydrateRows');
        }
        apiRef.current.applyAggregation();
      }

      return {
        params,
        response,
      };
    },
    [apiRef],
  );

  const resolveGroupAggregation = React.useCallback<
    GridDataSourcePremiumPrivateApi['resolveGroupAggregation']
  >(
    (groupId, field) => {
      if (groupId === GRID_ROOT_GROUP_ID) {
        return props.unstable_dataSource?.getAggregatedValue?.(aggregateRowRef.current, field);
      }
      const row = apiRef.current.getRow(groupId);
      return props.unstable_dataSource?.getAggregatedValue?.(row, field);
    },
    [apiRef, props.unstable_dataSource],
  );

  const privateApi: GridDataSourcePremiumPrivateApi = {
    ...api.private,
    resolveGroupAggregation,
  };

  useGridApiMethod(apiRef, api.public, 'public');
  useGridApiMethod(apiRef, privateApi, 'private');

  useGridRegisterStrategyProcessor(
    apiRef,
    strategyProcessor.strategyName,
    strategyProcessor.group,
    strategyProcessor.processor,
  );
  useGridRegisterPipeProcessor(apiRef, 'processDataSourceRows', processDataSourceRows);

  Object.entries(events).forEach(([event, handler]) => {
    addEventHandler(apiRef, event as keyof GridEventLookup, handler);
  });
};
