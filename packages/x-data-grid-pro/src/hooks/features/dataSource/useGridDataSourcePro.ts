'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import {
  useGridEvent as addEventHandler,
  useGridApiMethod,
  type GridEventLookup,
} from '@mui/x-data-grid';
import {
  type GridStateInitializer,
  useGridRegisterStrategyProcessor,
} from '@mui/x-data-grid/internals';
import type { GridPrivateApiPro } from '../../../models/gridApiPro';
import type { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { INITIAL_STATE, useGridDataSourceBasePro } from './useGridDataSourceBasePro';
import type { GridGetRowsParamsPro } from './models';

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
  const {
    api,
    flatTreeStrategyProcessor,
    groupedDataStrategyProcessor,
    events,
    setStrategyAvailability,
  } = useGridDataSourceBasePro(apiRef, props, options);

  useGridApiMethod(apiRef, api.public, 'public');
  useGridApiMethod(apiRef, api.private, 'private');

  useGridRegisterStrategyProcessor(
    apiRef,
    flatTreeStrategyProcessor.strategyName,
    flatTreeStrategyProcessor.group,
    flatTreeStrategyProcessor.processor,
  );
  useGridRegisterStrategyProcessor(
    apiRef,
    groupedDataStrategyProcessor.strategyName,
    groupedDataStrategyProcessor.group,
    groupedDataStrategyProcessor.processor,
  );

  Object.entries(events).forEach(([event, handler]) => {
    addEventHandler(apiRef, event as keyof GridEventLookup, handler);
  });

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);
};
