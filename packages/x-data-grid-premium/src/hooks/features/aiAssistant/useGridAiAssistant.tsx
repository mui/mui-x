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
import {
  gridAiAssistantConversationsSelector,
  gridAiAssistantConversationSelector,
  gridAiAssistantPanelOpenSelector,
  gridAiAssistantSuggestionsSelector,
  gridAiAssistantActiveConversationIdSelector,
} from './gridAiAssistantSelectors';

const INITIAL_CONVERSATION_ID = 'default'; // TODO: this will be dynamic once we start supporting multiple conversations
const DEFAULT_SAMPLE_COUNT = 5;

export const aiAssistantStateInitializer: GridStateInitializer<
  Pick<
    DataGridPremiumProcessedProps,
    | 'initialState'
    | 'aiAssistantPanelOpen'
    | 'aiAssistantConversations'
    | 'aiAssistantSuggestions'
    | 'aiAssistant'
  >
> = (state, props) => {
  if (!isAiAssistantAvailableFn(props)) {
    return {
      ...state,
      aiAssistant: {
        panelOpen: false,
        activeConversationId: INITIAL_CONVERSATION_ID,
        conversations: [],
        suggestions: [],
      } as GridAiAssistantState,
    };
  }

  return {
    ...state,
    aiAssistant: {
      panelOpen: props.aiAssistantPanelOpen ?? props.initialState?.aiAssistant?.panelOpen ?? false,
      conversations:
        props.aiAssistantConversations ?? props.initialState?.aiAssistant?.conversations ?? [],
      suggestions:
        props.aiAssistantSuggestions ?? props.initialState?.aiAssistant?.suggestions ?? [],
    } as GridAiAssistantState,
  };
};

export const useGridAiAssistant = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'aiAssistant'
    | 'aiAssistantPanelOpen'
    | 'aiAssistantConversations'
    | 'aiAssistantSuggestions'
    | 'allowAiAssistantDataSampling'
    | 'onAiAssistantPanelOpenChange'
    | 'onAiAssistantConversationsChange'
    | 'onAiAssistantSuggestionsChange'
    | 'onPrompt'
    | 'disableColumnFilter'
    | 'disableRowGrouping'
    | 'disableAggregation'
    | 'disableColumnSorting'
  >,
) => {
  const {
    onPrompt,
    allowAiAssistantDataSampling,
    disableColumnFilter,
    disableRowGrouping,
    disableAggregation,
    disableColumnSorting,
  } = props;
  const columnsLookup = gridColumnLookupSelector(apiRef);
  const columns = Object.values(columnsLookup);
  const rows = Object.values(gridRowsLookupSelector(apiRef));
  const isAiAssistantAvailable = isAiAssistantAvailableFn(props);

  apiRef.current.registerControlState({
    stateId: 'aiAssistantPanelOpen',
    propModel: props.aiAssistantPanelOpen,
    propOnChange: props.onAiAssistantPanelOpenChange,
    stateSelector: gridAiAssistantPanelOpenSelector,
    changeEvent: 'aiAssistantPanelOpenChange',
  });

  apiRef.current.registerControlState({
    stateId: 'aiAssistantConversations',
    propModel: props.aiAssistantConversations,
    propOnChange: props.onAiAssistantConversationsChange,
    stateSelector: gridAiAssistantConversationsSelector,
    changeEvent: 'aiAssistantConversationsChange',
  });

  apiRef.current.registerControlState({
    stateId: 'aiAssistantSuggestions',
    propModel: props.aiAssistantSuggestions,
    propOnChange: props.onAiAssistantSuggestionsChange,
    stateSelector: gridAiAssistantSuggestionsSelector,
    changeEvent: 'aiAssistantSuggestionsChange',
  });

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
      if (!isAiAssistantAvailable) {
        return '';
      }

      const examples = allowDataSampling ? collectSampleData() : {};

      const columnsContext = columns.map((column) => ({
        field: column.field,
        description: column.description ?? null,
        examples: examples[column.field] ?? column.examples ?? [],
        type: column.type ?? 'string',
        allowedOperators: column.filterOperators?.map((operator) => operator.value) ?? [],
      }));

      return JSON.stringify(columnsContext);
    },
    [columns, collectSampleData, isAiAssistantAvailable],
  );

  const applyPromptResult = React.useCallback(
    (result: PromptResponse) => {
      if (!isAiAssistantAvailable) {
        return;
      }

      const interestColumns = [] as string[];

      if (!disableColumnFilter) {
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

      if (!disableRowGrouping) {
        apiRef.current.setRowGroupingModel(result.grouping.map((g) => g.column));
      }

      if (!disableAggregation) {
        apiRef.current.setAggregationModel(result.aggregation);
        interestColumns.push(...Object.keys(result.aggregation));
      }

      if (!disableColumnSorting) {
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
      disableColumnFilter,
      disableRowGrouping,
      disableAggregation,
      disableColumnSorting,
      columnsLookup,
      isAiAssistantAvailable,
    ],
  );

  const setAiAssistantPanelOpen = React.useCallback<
    GridAiAssistantApi['aiAssistant']['setAiAssistantPanelOpen']
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

  const getAiAssistantConversation = React.useCallback<
    GridAiAssistantApi['aiAssistant']['getAiAssistantConversation']
  >(
    (id) => {
      if (!isAiAssistantAvailable) {
        return undefined;
      }

      return gridAiAssistantConversationSelector(apiRef, id);
    },
    [apiRef, isAiAssistantAvailable],
  );

  const setAiAssistantConversation = React.useCallback<
    GridAiAssistantApi['aiAssistant']['setAiAssistantConversation']
  >(
    (id, callback) => {
      if (!isAiAssistantAvailable) {
        return;
      }

      apiRef.current.setState((state) => ({
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          conversations: state.aiAssistant?.conversations.map((conversation) =>
            conversation.id === id
              ? {
                  ...conversation,
                  prompts:
                    typeof callback === 'function' ? callback(conversation.prompts) : callback,
                }
              : conversation,
          ),
        },
      }));
    },
    [apiRef, isAiAssistantAvailable],
  );

  const processPrompt = React.useCallback(
    async (value: string) => {
      if (!onPrompt) {
        return undefined;
      }

      const activeConversationId = gridAiAssistantActiveConversationIdSelector(apiRef);
      const isNewConversation = activeConversationId === INITIAL_CONVERSATION_ID;
      const date = Date.now();

      apiRef.current.setLoading(true);
      setAiAssistantConversation(activeConversationId, (prevPrompts) => [
        ...prevPrompts,
        {
          value,
          createdAt: new Date(date),
          variant: 'processing',
          helperText: apiRef.current.getLocaleText('promptProcessing'),
        },
      ]);
      try {
        const response = await onPrompt(
          value,
          getPromptContext(allowAiAssistantDataSampling),
          isNewConversation ? undefined : activeConversationId,
        );
        applyPromptResult(response);
        setAiAssistantConversation(activeConversationId, (prevPrompts) =>
          prevPrompts.map((item) =>
            item.createdAt.getTime() === date
              ? {
                  ...item,
                  response,
                  variant: 'success',
                }
              : item,
          ),
        );
        return response;
      } catch (error: any) {
        setAiAssistantConversation(activeConversationId, (prevPrompts) =>
          prevPrompts.map((item) =>
            item.createdAt.getTime() === date
              ? {
                  ...item,
                  variant: 'error',
                  helperText: error.message,
                }
              : item,
          ),
        );
        return error;
      } finally {
        apiRef.current.setLoading(false);
      }
    },
    [
      apiRef,
      allowAiAssistantDataSampling,
      onPrompt,
      getPromptContext,
      applyPromptResult,
      setAiAssistantConversation,
    ],
  );

  React.useEffect(() => {
    if (props.aiAssistantConversations) {
      props.aiAssistantConversations.forEach((conversation) => {
        setAiAssistantConversation(conversation.id, conversation.prompts);
      });
    }
  }, [apiRef, props.aiAssistantConversations, setAiAssistantConversation]);

  React.useEffect(() => {
    if (props.aiAssistantPanelOpen) {
      setAiAssistantPanelOpen(props.aiAssistantPanelOpen);
    }
  }, [apiRef, props.aiAssistantPanelOpen, setAiAssistantPanelOpen]);

  useGridApiMethod(
    apiRef,
    {
      aiAssistant: {
        processPrompt,
        setAiAssistantPanelOpen,
        getAiAssistantConversation,
        setAiAssistantConversation,
      },
    },
    'public',
  );
};
