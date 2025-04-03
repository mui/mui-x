import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridRegisterStrategyProcessor } from '../../core/strategyProcessing/useGridRegisterStrategyProcessor';
import { useGridEvent as addEventHandler } from '../../utils/useGridEvent';
import { useGridDataSourceBase } from './useGridDataSourceBase';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import type { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import type { GridEventLookup } from '../../../models/events';

/**
 * Community version of the data source hook. Contains implementation of the `useGridDataSourceBase` hook.
 */
export const useGridDataSource = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: DataGridProcessedProps,
) => {
  const { api, strategyProcessor, events, setStrategyAvailability } = useGridDataSourceBase(
    apiRef,
    props,
  );

  useGridApiMethod(apiRef, api.public, 'public');

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
