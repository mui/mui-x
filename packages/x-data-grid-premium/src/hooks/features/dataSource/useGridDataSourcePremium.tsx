'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  useGridEvent as addEventHandler,
  useGridApiMethod,
  GridEventLookup,
  GRID_ROOT_GROUP_ID,
  GridValidRowModel,
  useGridEvent,
  GridColumnGroupingModel,
  GridColDef,
} from '@mui/x-data-grid-pro';
import {
  useGridDataSourceBasePro,
  useGridRegisterStrategyProcessor,
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
  gridPivotInitialColumnsSelector,
  runIf,
  gridPivotActiveSelector,
} from '@mui/x-data-grid-pro/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { gridPivotModelSelector } from '../pivoting/gridPivotingSelectors';
import { sortColumnGroups } from '../pivoting/utils';
import type { GridColumnGroupPivoting } from '../pivoting/utils';
import type { GridAggregationModel } from '../aggregation/gridAggregationInterfaces';
import type {
  GridDataSourcePremiumPrivateApi,
  GridGetRowsParamsPremium,
  GridGetRowsResponsePremium,
} from './models';

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

export const useGridDataSourcePremium = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProcessedProps,
) => {
  const { api, debouncedFetchRows, strategyProcessor, events, setStrategyAvailability } =
    useGridDataSourceBasePro<GridPrivateApiPremium>(apiRef, props, options);
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
        const getPivotColumnDef = props.dataSource?.getPivotColumnDef;
        if (!getPivotColumnDef) {
          throw new Error('MUI X: No `getPivotColumnDef` method provided with the dataSource.');
        }

        const visiblePivotColumns = pivotModel.columns.filter((column) => !column.hidden);
        const columnDefinitions: Record<string, GridColDef> = Object.fromEntries(
          initialColumns.entries(),
        );
        // Build column grouping model from pivot column paths
        const columnGroupingModel: GridColumnGroupingModel = [];
        const columnGroupingModelLookup = new Map<string, any>();

        // Build new columns lookup and ordered fields
        const newColumns: Record<string, GridColDef> = {};

        // Build aggregation model
        const aggregationModel: GridAggregationModel = {};

        response.pivotColumns.forEach((columnPath) => {
          if (columnPath.length === 0) {
            return;
          }

          const lastField = columnPath[columnPath.length - 1];
          if (typeof lastField !== 'string') {
            throw new Error('MUI X: Last item in `pivotColumns` must be a column field.');
          }

          const pivotValue = pivotModel.values.find((value) => value.field === lastField);

          // Find the original column definition for the last field
          const originalColumn = initialColumns.get(lastField);
          // get the overrides defined from the data source definition
          const overrides = getPivotColumnDef(columnPath, columnDefinitions);

          // Create new column definition based on original column
          const newColumnDef = {
            ...originalColumn,
            ...overrides,
            aggregable: false,
            groupable: false,
            filterable: false,
            hideable: false,
            editable: false,
            disableReorder: true,
          } as GridColDef;

          const pivotFieldName = newColumnDef.field!;
          newColumns[pivotFieldName] = newColumnDef;
          if (pivotValue?.aggFunc) {
            aggregationModel[pivotFieldName] = pivotValue.aggFunc;
          }

          // Build column grouping model
          if (columnPath.length > 1) {
            const columnPathValues = columnPath.map((path, index) =>
              typeof path === 'string'
                ? path
                : apiRef.current.getRowValue(
                    path,
                    initialColumns.get(visiblePivotColumns[index].field)!,
                  ),
            );

            // Build the hierarchy for column groups
            for (let i = 0; i < columnPathValues.length - 1; i += 1) {
              const currentField = visiblePivotColumns[i].field;
              const groupPath = columnPathValues.slice(0, i + 1);
              const groupId = groupPath.join('-');

              let headerName = columnPath[groupPath.length - 1];
              const rawHeaderName = columnPathValues[groupPath.length - 1];
              if (typeof headerName !== 'string') {
                headerName = apiRef.current.getRowFormattedValue(
                  headerName,
                  initialColumns.get(currentField)!,
                );
              }
              if (typeof headerName !== 'string') {
                throw new Error(
                  `MUI X: Header name for a column group based on ${currentField} cannot be converted to a string.`,
                );
              }

              if (!columnGroupingModelLookup.has(groupId)) {
                const columnGroup = {
                  groupId,
                  headerName,
                  rawHeaderName,
                  children: [],
                };

                columnGroupingModelLookup.set(groupId, columnGroup);

                if (i === 0) {
                  columnGroupingModel.push(columnGroup);
                } else {
                  const parentGroupId = groupPath.slice(0, -1).join('-');
                  const parentGroup = columnGroupingModelLookup.get(parentGroupId);
                  if (parentGroup) {
                    parentGroup.children.push(columnGroup);
                  }
                }
              }
            }

            // Add the final column to the appropriate group
            const parentGroupId = columnPathValues.slice(0, -1).join('-');
            const parentGroup = columnGroupingModelLookup.get(parentGroupId);
            if (parentGroup) {
              parentGroup.children.push({ field: pivotFieldName });
            }
          }
        });

        sortColumnGroups(columnGroupingModel as GridColumnGroupPivoting[], visiblePivotColumns);

        // Update the grid state with new columns and column grouping model
        apiRef.current.setState((state) => {
          return {
            ...state,
            pivoting: {
              ...state.pivoting,
              propsOverrides: {
                ...state.pivoting.propsOverrides!,
                columns: [...Object.values(columnDefinitions), ...Object.values(newColumns)],
                columnGroupingModel,
                aggregationModel,
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
    [apiRef, initialColumns, pivotModel, props.dataSource],
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
    strategyProcessor.strategyName,
    strategyProcessor.group,
    strategyProcessor.processor,
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
  useGridEvent(apiRef, 'pivotModeChange', () => debouncedFetchRows());
  useGridEvent(
    apiRef,
    'pivotModelChange',
    runIf(pivotActive, () => debouncedFetchRows()),
  );

  React.useEffect(() => {
    setStrategyAvailability();
  }, [setStrategyAvailability]);
};
