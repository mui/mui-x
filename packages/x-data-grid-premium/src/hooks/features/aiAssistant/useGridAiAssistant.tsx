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
import {
  getValueOptions,
  getVisibleRows,
  GridStateInitializer,
} from '@mui/x-data-grid-pro/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  GridAiAssistantApi,
  GridAiAssistantState,
  PromptResponse,
} from './gridAiAssistantInterfaces';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { isAiAssistantAvailable as isAiAssistantAvailableFn } from './utils';

const DEFAULT_SAMPLE_COUNT = 5;

export const aiAssistantStateInitializer: GridStateInitializer<
  Pick<
    DataGridPremiumProcessedProps,
    | 'initialState'
    | 'aiAssistantPanelOpen'
    | 'aiAssistantHistory'
    | 'aiAssistantSuggestions'
    | 'enableAiAssistant'
  >
> = (state, props) => {
  if (!isAiAssistantAvailableFn(props)) {
    return {
      ...state,
      aiAssistant: {
        panelOpen: false,
        history: [],
        suggestions: [],
      } as GridAiAssistantState,
    };
  }

  return {
    ...state,
    aiAssistant: {
      panelOpen: props.aiAssistantPanelOpen ?? props.initialState?.aiAssistant?.panelOpen ?? false,
      history: props.aiAssistantHistory ?? props.initialState?.aiAssistant?.history ?? [],
      suggestions:
        props.aiAssistantSuggestions ?? props.initialState?.aiAssistant?.suggestions ?? [],
    } as GridAiAssistantState,
  };
};

export const useGridAiAssistant = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'enableAiAssistant'
    | 'disableColumnFilter'
    | 'disableRowGrouping'
    | 'disableAggregation'
    | 'disableColumnSorting'
  >,
) => {
  const columnsLookup = gridColumnLookupSelector(apiRef);
  const columns = Object.values(columnsLookup);
  const rows = Object.values(gridRowsLookupSelector(apiRef));
  const isAiAssistantAvailable = isAiAssistantAvailableFn(props);

  const collectSampleData = React.useCallback(() => {
    const columnExamples: Record<string, any[]> = {};

    columns.forEach((column) => {
      columnExamples[column.field] = Array.from({
        length: Math.min(DEFAULT_SAMPLE_COUNT, rows.length),
      }).map(() => {
        const row = rows[Math.floor(Math.random() * rows.length)];
        if (column.valueGetter) {
          return column.valueGetter(row[column.field] as never, row, column, apiRef);
        }
        return row[column.field];
      });
    });

    return columnExamples;
  }, [apiRef, columns, rows]);

  const getPromptContext = React.useCallback(
    (allowDataSampling = false) => {
      const examples = allowDataSampling ? collectSampleData() : {};

      const columnsContext = columns.map((column) => ({
        field: column.field,
        description: column.description ?? null,
        examples: examples[column.field] ?? column.unstable_examples ?? [],
        type: column.type ?? 'string',
        allowedOperators: column.filterOperators?.map((operator) => operator.value) ?? [],
      }));

      return JSON.stringify(columnsContext);
    },
    [columns, collectSampleData],
  );

  const applyPromptResult = React.useCallback(
    (result: PromptResponse) => {
      const interestColumns = [] as string[];

      if (!props.disableColumnFilter) {
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
        interestColumns.push(...result.filters.map((f) => f.column));
      }

      // TODO: add pivoting
      // apiRef.current.setPivotingModel(result.pivoting); <- some transformation is needed

      // TODO: if pivoting is disabled and there are pivoting results, try to move them into grouping and aggregation

      if (!props.disableRowGrouping) {
        apiRef.current.setRowGroupingModel(result.grouping.map((g) => g.column));
      }

      if (!props.disableAggregation) {
        apiRef.current.setAggregationModel(result.aggregation);
        interestColumns.push(...Object.keys(result.aggregation));
      }

      if (!props.disableColumnSorting) {
        apiRef.current.setSortModel(
          result.sorting.map((s) => ({ field: s.column, sort: s.direction })),
        );
      }

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

      interestColumns.reverse().forEach((c) => apiRef.current.setColumnIndex(c, targetIndex));
    },
    [
      apiRef,
      props.disableColumnFilter,
      props.disableRowGrouping,
      props.disableAggregation,
      props.disableColumnSorting,
      columnsLookup,
    ],
  );

  const setAiAssistantPanelOpen = React.useCallback<
    GridAiAssistantApi['unstable_aiAssistant']['setAiAssistantPanelOpen']
  >(
    (callback) => {
      if (!isAiAssistantAvailable) {
        return;
      }
      apiRef.current.setState((state) => ({
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          panelOpen:
            typeof callback === 'function' ? callback(state.aiAssistant?.panelOpen) : callback,
        },
      }));
    },
    [apiRef, isAiAssistantAvailable],
  );

  const setAiAssistantHistory = React.useCallback<
    GridAiAssistantApi['unstable_aiAssistant']['setAiAssistantHistory']
  >(
    (callback) => {
      apiRef.current.setState((state) => ({
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          history: typeof callback === 'function' ? callback(state.aiAssistant?.history) : callback,
        },
      }));
    },
    [apiRef],
  );

  // TODO: implement suggestions setter

  // TODO: sync controlled history with grid state

  // TODO: sync controlled suggestions with grid state

  useGridApiMethod(
    apiRef,
    {
      unstable_aiAssistant: {
        getPromptContext,
        applyPromptResult,
        setAiAssistantPanelOpen,
        setAiAssistantHistory,
      },
    },
    'public',
  );
};
