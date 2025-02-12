import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  useGridApiEventHandler as addEventHandler,
  useGridApiMethod,
  GridEventLookup,
} from '@mui/x-data-grid';
import { GridStateInitializer, useGridRegisterStrategyProcessor } from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { INITIAL_STATE, useGridDataSourceBasePro } from './useGridDataSourceBasePro';
import { GridGetRowsParamsPro } from './models';

function getKeyPro(params: GridGetRowsParamsPro) {
  return JSON.stringify([
    params.filterModel,
    params.sortModel,
    params.groupKeys,
    params.start,
    params.end,
  ]);
}

export const dataSourceStateInitializer: GridStateInitializer = (state) => {
  return {
    ...state,
    dataSource: INITIAL_STATE,
  };
};

const options = {
  cacheOptions: {
    getKey: getKeyPro,
  },
};

export const useGridDataSourcePro = (
  apiRef: RefObject<GridPrivateApiPro>,
  props: DataGridProProcessedProps,
) => {
  const { api, strategyProcessor, events, setStrategyAvailability } = useGridDataSourceBasePro(
    apiRef,
    props,
    options,
  );

  useGridApiMethod(apiRef, api.public, 'public');
  useGridApiMethod(apiRef, api.private, 'private');

  useGridRegisterStrategyProcessor(
    apiRef,
    strategyProcessor.strategyName,
    strategyProcessor.group,
    strategyProcessor.processor,
  );

  Object.entries(events).forEach(([event, handler]) => {
    addEventHandler(apiRef, event as keyof GridEventLookup, handler);
  });

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);
};
