'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import {
  useGridEvent as addEventHandler,
  useGridApiMethod,
  type GridEventLookup,
  GRID_ROOT_GROUP_ID,
  type GridValidRowModel,
  useGridEvent,
  type GridUpdateRowParams,
  type GridRowModel,
  gridRowTreeSelector,
} from '@mui/x-data-grid-pro';
import {
  useGridDataSourceBasePro,
  useGridRegisterStrategyProcessor,
  type GridPipeProcessor,
  useGridRegisterPipeProcessor,
  gridPivotInitialColumnsSelector,
  runIf,
  gridPivotActiveSelector,
  GridStrategyGroup,
  DataSourceRowsUpdateStrategy,
  getGroupKeys,
} from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { gridPivotModelSelector } from '../pivoting/gridPivotingSelectors';
import type {
  GridDataSourcePremiumPrivateApi,
  GridGetRowsParamsPremium,
  GridGetRowsResponsePremium,
} from './models';
import { getPropsOverrides, fetchParents } from './utils';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping/gridRowGroupingSelector';
import { gridAggregationModelSelector } from '../aggregation/gridAggregationSelectors';

function getKeyPremium(params: GridGetRowsParamsPremium) {
  return JSON.stringify([
    params.filterModel,
    params.sortModel,
    params.groupKeys,
    params.groupFields,
    params.start,
    params.end,
    params.pivotModel ? {} : params.aggregationModel,
    params.pivotModel,
  ]);
}

const options = {
  cacheOptions: {
    getKey: getKeyPremium,
  },
};

const getStrategies = (
  props: Pick<DataGridPremiumProcessedProps, 'treeData' | 'lazyLoading' | 'disableRowGrouping'>,
  groupingModelSize: number,
) => {
  const previousStrategies = new Set([
    DataSourceRowsUpdateStrategy.Default,
    DataSourceRowsUpdateStrategy.GroupedData,
    DataSourceRowsUpdateStrategy.LazyLoadedGroupedData,
  ]);
  let currentStrategy = DataSourceRowsUpdateStrategy.Default;
  if (props.treeData || (!props.disableRowGrouping && groupingModelSize > 0)) {
    currentStrategy = props.lazyLoading
      ? DataSourceRowsUpdateStrategy.LazyLoadedGroupedData
      : DataSourceRowsUpdateStrategy.GroupedData;
  }
  previousStrategies.delete(currentStrategy);
  return { currentStrategy, previousStrategies: Array.from(previousStrategies) };
};

export const useGridDataSourcePremium = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProcessedProps,
) => {
  const aggregationModel = gridAggregationModelSelector(apiRef);
  const groupingModelSize = gridRowGroupingSanitizedModelSelector(apiRef).length;
  const setStrategyAvailability = React.useCallback(() => {
    const { currentStrategy, previousStrategies } = getStrategies(
      {
        treeData: props.treeData,
        lazyLoading: props.lazyLoading,
        disableRowGrouping: props.disableRowGrouping,
      },
      groupingModelSize,
    );
    const [prevStrategy1, prevStrategy2] = previousStrategies;

    apiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      prevStrategy1,
      () => false,
    );
    apiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      prevStrategy2,
      () => false,
    );

    apiRef.current.setStrategyAvailability(
      GridStrategyGroup.DataSource,
      currentStrategy,
      props.dataSource ? () => true : () => false,
    );
  }, [
    apiRef,
    props.dataSource,
    props.lazyLoading,
    props.treeData,
    props.disableRowGrouping,
    groupingModelSize,
  ]);

  const handleEditRowWithAggregation = React.useCallback(
    (params: GridUpdateRowParams, updatedRow: GridRowModel) => {
      const rowTree = gridRowTreeSelector(apiRef);
      if (updatedRow && !isDeepEqual(updatedRow, params.previousRow)) {
        // Reset the outdated cache, only if the row is _actually_ updated
        apiRef.current.dataSource.cache.clear();
      }
      const groupKeys = getGroupKeys(rowTree, params.rowId) as string[];
      apiRef.current.updateNestedRows([updatedRow], groupKeys);
      // To refresh the aggregation values of all parent rows and the footer row, recursively re-fetch all parent levels
      fetchParents(rowTree, params.rowId, apiRef.current.dataSource.fetchRows);
    },
    [apiRef],
  );

  const {
    api,
    debouncedFetchRows,
    flatTreeStrategyProcessor,
    groupedDataStrategyProcessor,
    nestedDataStrategyProcessor,
    events,
  } = useGridDataSourceBasePro<GridPrivateApiPremium>(apiRef, props, {
    ...(!props.disableAggregation && Object.keys(aggregationModel).length > 0
      ? { handleEditRow: handleEditRowWithAggregation }
      : {}),
    ...options,
  });
  const aggregateRowRef = React.useRef<GridValidRowModel>({});

  const initialColumns = gridPivotInitialColumnsSelector(apiRef);
  const pivotActive = gridPivotActiveSelector(apiRef);
  const pivotModel = gridPivotModelSelector(apiRef);

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

      if (response.pivotColumns) {
        const pivotingColDef = props.pivotingColDef;
        if (!pivotingColDef || typeof pivotingColDef !== 'function') {
          throw new Error(
            'MUI X: No `pivotingColDef()` prop provided with to the Data Grid, but response contains `pivotColumns`.\n\n\
            You need a callback to return at least a field column prop for each generated pivot column.\n\n\
            See [server-side pivoting](https://mui.com/x/react-data-grid/server-side-data/pivoting/) documentation for more details.',
          );
        }

        // Update the grid state with new columns and column grouping model
        const partialPropsOverrides = getPropsOverrides(
          response.pivotColumns,
          pivotingColDef,
          pivotModel,
          initialColumns,
          apiRef,
        );

        apiRef.current.setState((state) => {
          return {
            ...state,
            pivoting: {
              ...state.pivoting,
              propsOverrides: {
                ...state.pivoting.propsOverrides!,
                ...partialPropsOverrides,
              },
            },
          };
        });
      }

      return {
        params,
        response,
      };
    },
    [apiRef, props.pivotingColDef, initialColumns, pivotModel],
  );

  const resolveGroupAggregation = React.useCallback<
    GridDataSourcePremiumPrivateApi['resolveGroupAggregation']
  >(
    (groupId, field) => {
      if (groupId === GRID_ROOT_GROUP_ID) {
        return props.dataSource?.getAggregatedValue?.(aggregateRowRef.current, field);
      }
      const row = apiRef.current.getRow(groupId);
      return props.dataSource?.getAggregatedValue?.(row, field);
    },
    [apiRef, props.dataSource],
  );

  const privateApi: GridDataSourcePremiumPrivateApi = {
    ...api.private,
    resolveGroupAggregation,
  };

  useGridApiMethod(apiRef, api.public, 'public');
  useGridApiMethod(apiRef, privateApi, 'private');

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
  useGridRegisterStrategyProcessor(
    apiRef,
    nestedDataStrategyProcessor.strategyName,
    nestedDataStrategyProcessor.group,
    nestedDataStrategyProcessor.processor,
  );

  useGridRegisterPipeProcessor(apiRef, 'processDataSourceRows', processDataSourceRows);

  Object.entries(events).forEach(([event, handler]) => {
    addEventHandler(apiRef, event as keyof GridEventLookup, handler);
  });

  useGridEvent(
    apiRef,
    'rowGroupingModelChange',
    runIf(!pivotActive, () => debouncedFetchRows()),
  );
  useGridEvent(
    apiRef,
    'aggregationModelChange',
    runIf(!pivotActive, () => debouncedFetchRows()),
  );
  useGridEvent(
    apiRef,
    'pivotModeChange',
    runIf(!pivotActive, () => debouncedFetchRows()),
  );
  useGridEvent(
    apiRef,
    'pivotModelChange',
    runIf(pivotActive, () => debouncedFetchRows()),
  );

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);
};
