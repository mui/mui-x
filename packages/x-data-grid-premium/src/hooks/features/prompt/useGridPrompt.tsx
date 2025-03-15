import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  GridRowSelectionModel,
  gridColumnLookupSelector,
  GridLogicOperator,
  gridRowsLookupSelector,
  GridSingleSelectColDef,
  useGridApiMethod,
  GRID_CHECKBOX_SELECTION_FIELD,
} from '@mui/x-data-grid-pro';
import { getValueOptions, getVisibleRows } from '@mui/x-data-grid-pro/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { PromptResponse } from './gridPromptInterfaces';

const MAX_SAMPLE_COUNT = 20;

export const useGridPrompt = (apiRef: RefObject<GridPrivateApiPremium>) => {
  const columnsLookup = gridColumnLookupSelector(apiRef);
  const columns = Object.values(columnsLookup);
  const rows = Object.values(gridRowsLookupSelector(apiRef));

  const collectSampleData = React.useCallback(
    (sampleCount = 5) => {
      const columnExamples: Record<string, any[]> = {};

      columns.forEach((column) => {
        columnExamples[column.field] = Array.from({
          length: Math.min(sampleCount, rows.length, MAX_SAMPLE_COUNT),
        }).map(() => {
          const row = rows[Math.floor(Math.random() * rows.length)];
          if (column.valueGetter) {
            return column.valueGetter(row[column.field] as never, row, column, apiRef);
          }
          return row[column.field];
        });
      });

      return columnExamples;
    },
    [apiRef, columns, rows],
  );

  const getPromptContext = React.useCallback(
    (examples?: Record<string, any[]>) => {
      const columnsContext = columns.map((column) => ({
        field: column.field,
        description: column.description ?? null,
        examples: examples?.[column.field] ?? column.unstable_examples ?? [],
        type: column.type ?? 'string',
        allowedOperators: column.filterOperators?.map((operator) => operator.value) ?? [],
      }));

      return `The columns are described by the following JSON:\n${JSON.stringify(columnsContext)}`;
    },
    [columns],
  );

  const applyPromptResult = React.useCallback(
    (result: PromptResponse) => {
      const interestColumns = [] as string[];

      apiRef.current.setFilterModel({
        items: result.filters.map((filter, index) => {
          const item = {
            id: index,
            field: filter.column,
            operator: filter.operator,
            value: filter.value,
          };

          const column = columnsLookup[filter.column];
          if (column.type === 'singleSelect') {
            const options = getValueOptions(column as GridSingleSelectColDef) ?? [];
            const found = options.find(
              (option) => typeof option === 'object' && option.label === filter.value,
            );
            if (found) {
              item.value = (found as any).value;
            }
          }

          return item;
        }),
        logicOperator: (result.filterOperator as GridLogicOperator) ?? GridLogicOperator.And,
        quickFilterValues: [],
      });

      apiRef.current.setRowGroupingModel(result.grouping.map((g) => g.column));
      apiRef.current.setAggregationModel(result.aggregation);

      apiRef.current.setSortModel(
        result.sorting.map((s) => ({ field: s.column, sort: s.direction })),
      );

      const visibleRowsData = getVisibleRows(apiRef);
      const rowSelectionModel: GridRowSelectionModel = { type: 'include', ids: new Set() };
      if (result.select !== -1) {
        for (let i = 0; i < result.select; i += 1) {
          const row = visibleRowsData.rows[i];
          const id = apiRef.current.getRowId(row);
          rowSelectionModel.ids.add(id);
        }
      }

      apiRef.current.setRowSelectionModel(rowSelectionModel);

      const targetIndex =
        Number(columnsLookup[GRID_CHECKBOX_SELECTION_FIELD] !== undefined) +
        Number(result.grouping.length);

      interestColumns.push(...Object.keys(result.aggregation));
      interestColumns.push(...result.filters.map((f) => f.column));
      interestColumns.reverse().forEach((c) => apiRef.current.setColumnIndex(c, targetIndex));
    },
    [apiRef, columnsLookup],
  );

  useGridApiMethod(
    apiRef,
    {
      collectSampleData,
      getPromptContext,
      applyPromptResult,
    },
    'public',
  );
};
