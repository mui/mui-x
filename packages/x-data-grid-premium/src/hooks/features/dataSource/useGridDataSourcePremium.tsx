import * as React from 'react';
import {
  useGridApiEventHandler as addEventHandler,
  useGridApiMethod,
  useGridSelector,
  GridEventLookup,
  GRID_ROOT_GROUP_ID,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import {
  useGridDataSourceBase,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
  GridStrategyProcessorName,
} from '@mui/x-data-grid-pro/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridDataSourcePremiumPrivateApi, GridGetRowsResponsePremium } from './models';
import { gridAggregationModelSelector } from '../aggregation/gridAggregationSelectors';

export const useGridDataSourcePremium = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProcessedProps,
) => {
  const { api, strategyProcessor, events } = useGridDataSourceBase<GridPrivateApiPremium>(
    apiRef,
    props,
  );
  const aggregationModel = useGridSelector(apiRef, gridAggregationModelSelector);
  const aggregateRowRef = React.useRef<GridValidRowModel>({});

  const handleDataUpdate = React.useCallback<GridStrategyProcessor<'dataSourceRowsUpdate'>>(
    (params) => {
      if ('error' in params) {
        apiRef.current.setRows([]);
        return;
      }

      const { response }: { response: GridGetRowsResponsePremium } = params;
      if (response.rowCount !== undefined) {
        apiRef.current.setRowCount(response.rowCount);
      }
      apiRef.current.setRows(response.rows);
      if (response.aggregateRow) {
        aggregateRowRef.current = response.aggregateRow;
      }
      if (Object.keys(aggregationModel).length > 0) {
        apiRef.current.requestPipeProcessorsApplication('hydrateRows');
        apiRef.current.applyAggregation();
      }
    },
    [apiRef, aggregationModel],
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
    strategyProcessor.group as GridStrategyProcessorName,
    handleDataUpdate as any,
  );

  Object.entries(events).forEach(([event, handler]) => {
    addEventHandler(apiRef, event as keyof GridEventLookup, handler);
  });
};
