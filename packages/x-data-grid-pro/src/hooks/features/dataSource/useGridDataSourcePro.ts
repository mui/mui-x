import * as React from 'react';
import {
  useGridApiEventHandler as addEventHandler,
  useGridApiMethod,
  GridEventLookup,
} from '@mui/x-data-grid';
import { useGridRegisterStrategyProcessor } from '@mui/x-data-grid/internals';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { useGridDataSourceBase } from './useGridDataSourceBase';

export const useGridDataSourcePro = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: DataGridProProcessedProps,
) => {
  const { api, strategyProcessor, events } = useGridDataSourceBase(apiRef, props);

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
};
