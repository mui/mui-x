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
  gridStringOrNumberComparator,
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
import type { GridAggregationModel } from '../aggregation/gridAggregationInterfaces';
import type {
  GridDataSourcePremiumPrivateApi,
  GridGetRowsParamsPremium,
  GridGetRowsResponsePivotColumn,
  GridGetRowsResponsePremium,
  GridDataSourcePivotColumnGroupPath,
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
          throw new Error(
            'MUI X: No `getPivotColumnDef()` method provided with the `dataSource` prop, but response contains `pivotColumns`\n\n\
            See [server-side pivoting](https://mui.com/x/react-data-grid/server-side-data/pivoting/) documentation for more details.',
          );
        }

        const visiblePivotColumns = pivotModel.columns.filter((column) => !column.hidden);
        const visiblePivotValues = pivotModel.values.filter((value) => !value.hidden);
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

        // Create unique combinations of all values from pivotColumns and pivotValues
        const uniquePaths: GridDataSourcePivotColumnGroupPath[][] = [];

        const processPath = (
          currentPath: GridDataSourcePivotColumnGroupPath[],
          remainingColumns: GridGetRowsResponsePivotColumn[],
          level: number,
        ) => {
          if (level === visiblePivotColumns.length) {
            uniquePaths.push([...currentPath]);
            return;
          }

          remainingColumns.forEach((column) => {
            processPath(
              [...currentPath, { field: visiblePivotColumns[level].field, value: column.group }],
              column.children || [],
              level + 1,
            );
          });
        };
        processPath([], response.pivotColumns, 0);

        /**
         * Column group headers are sorted by the leaf columns order in the column definition.
         * Store the values of each column group path to be able to sort them by pivot column sort order.
         * The values are stored by the column group level which allows easier sorting by going through the column group levels in reverse order.
         */
        const columnGroupPathValues: { field: string; pathValues: string[] }[] = [];

        uniquePaths.forEach((columnPath) => {
          const columnPathValues = columnPath.map((path) => path.value);
          visiblePivotValues.forEach((pivotValue) => {
            // Find the original column definition for the last field
            const originalColumn = initialColumns.get(pivotValue.field);
            // get the overrides defined from the data source definition
            const overrides = getPivotColumnDef(pivotValue.field, columnPath, columnDefinitions);

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
            aggregationModel[pivotFieldName] = pivotValue.aggFunc;

            // Build column grouping model
            const combinedPathValues = [...columnPathValues, pivotValue.field].map((path, index) =>
              typeof path === 'string'
                ? path
                : apiRef.current.getRowValue(
                    path,
                    initialColumns.get(visiblePivotColumns[index].field)!,
                  ),
            );
            columnGroupPathValues.push({ field: pivotFieldName, pathValues: combinedPathValues });

            // Build the hierarchy for column groups
            for (let i = 0; i < combinedPathValues.length - 1; i += 1) {
              const currentField = visiblePivotColumns[i].field;
              const groupPath = combinedPathValues.slice(0, i + 1);
              const groupId = groupPath.join('-');

              let headerName = columnPathValues[groupPath.length - 1];
              if (typeof headerName !== 'string') {
                headerName = apiRef.current.getRowFormattedValue(
                  headerName,
                  initialColumns.get(currentField)!,
                );
              }
              if (typeof headerName === 'number') {
                headerName = String(headerName);
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
            const parentGroupId = combinedPathValues.slice(0, -1).join('-');
            const parentGroup = columnGroupingModelLookup.get(parentGroupId);
            if (parentGroup) {
              parentGroup.children.push({ field: pivotFieldName });
            }
          });
        });

        for (let i = visiblePivotColumns.length - 1; i >= 0; i -= 1) {
          const sort = visiblePivotColumns[i].sort;
          if (!sort) {
            continue;
          }
          columnGroupPathValues.sort((a, b) => {
            return (
              (sort === 'asc' ? 1 : -1) *
              gridStringOrNumberComparator(a.pathValues[i], b.pathValues[i], {} as any, {} as any)
            );
          });
        }

        const sortedNewColumns = visiblePivotColumns.length
          ? columnGroupPathValues.map((pathValue) => newColumns[pathValue.field])
          : [];

        // Update the grid state with new columns and column grouping model
        apiRef.current.setState((state) => {
          return {
            ...state,
            pivoting: {
              ...state.pivoting,
              propsOverrides: {
                ...state.pivoting.propsOverrides!,
                columns: [...Object.values(columnDefinitions), ...sortedNewColumns],
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
