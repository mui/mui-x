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
  Prompt,
  PromptResponse,
} from './gridAiAssistantInterfaces';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { isAiAssistantAvailable as isAiAssistantAvailableFn } from './utils';
import {
  gridAiAssistantConversationsSelector,
  gridAiAssistantPanelOpenSelector,
  gridAiAssistantSuggestionsSelector,
  gridAiAssistantActiveConversationSelector,
  gridAiAssistantActiveConversationIndexSelector,
} from './gridAiAssistantSelectors';

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
        activeConversationIndex: 0,
        conversations: [],
        suggestions: [],
      } as GridAiAssistantState,
    };
  }

  return {
    ...state,
    aiAssistant: {
      panelOpen: props.aiAssistantPanelOpen ?? props.initialState?.aiAssistant?.panelOpen ?? false,
      activeConversationIndex: 0,
      conversations:
        props.aiAssistantConversations ?? props.initialState?.aiAssistant?.conversations ?? [],
      suggestions: props.aiAssistantSuggestions ?? [],
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
    | 'aiAssistantActiveConversationIndex'
    | 'allowAiAssistantDataSampling'
    | 'onAiAssistantPanelOpenChange'
    | 'onAiAssistantConversationsChange'
    | 'onAiAssistantSuggestionsChange'
    | 'onAiAssistantActiveConversationIndexChange'
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

  apiRef.current.registerControlState({
    stateId: 'aiAssistantActiveConversationIndex',
    propModel: props.aiAssistantActiveConversationIndex,
    propOnChange: props.onAiAssistantActiveConversationIndexChange,
    stateSelector: gridAiAssistantActiveConversationIndexSelector,
    changeEvent: 'aiAssistantActiveConversationIndexChange',
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

  const setPanelOpen = React.useCallback<GridAiAssistantApi['aiAssistant']['setPanelOpen']>(
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

  const setActiveConversationId = React.useCallback(
    (id: string) => {
      if (!isAiAssistantAvailable) {
        return;
      }

      const conversations = gridAiAssistantConversationsSelector(apiRef);
      const activeConversationIndex = gridAiAssistantActiveConversationIndexSelector(apiRef);

      if (!conversations[activeConversationIndex]) {
        return;
      }

      conversations[activeConversationIndex].id = id;

      apiRef.current.setState((state) => ({
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          conversations,
        },
      }));
    },
    [apiRef, isAiAssistantAvailable],
  );

  const setConversationPrompts = React.useCallback(
    (index: number, callback: (prevPrompts: Prompt[]) => Prompt[]) => {
      if (!isAiAssistantAvailable) {
        return;
      }

      const currentConversations = gridAiAssistantConversationsSelector(apiRef);
      const targetConversation = currentConversations[index];

      const newPrompts =
        typeof callback === 'function'
          ? callback(targetConversation === undefined ? [] : targetConversation.prompts)
          : callback;

      const newConversations = currentConversations.toSpliced(
        targetConversation === undefined ? currentConversations.length : index,
        1,
        {
          ...targetConversation,
          title: newPrompts[newPrompts.length - 1].value, // TODO: make the title configurable
          prompts: newPrompts,
        },
      );

      apiRef.current.setState((state) => ({
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          conversations: newConversations,
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

      const activeConversationIndex = gridAiAssistantActiveConversationIndexSelector(apiRef);
      const activeConversation = gridAiAssistantActiveConversationSelector(apiRef);
      const date = Date.now();

      apiRef.current.setLoading(true);
      setConversationPrompts(activeConversationIndex, (prevPrompts) => [
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
          activeConversation?.id,
        );
        applyPromptResult(response);
        setActiveConversationId(response.conversationId);
        setConversationPrompts(activeConversationIndex, (prevPrompts) =>
          prevPrompts.map((item) =>
            item.createdAt.getTime() === date
              ? {
                  ...item,
                  response,
                  variant: 'success',
                  helperText: '',
                }
              : item,
          ),
        );
        return response;
      } catch (error: any) {
        setConversationPrompts(activeConversationIndex, (prevPrompts) =>
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
      setConversationPrompts,
      setActiveConversationId,
    ],
  );

  const setActiveConversationIndex = React.useCallback<
    GridAiAssistantApi['aiAssistant']['setActiveConversationIndex']
  >(
    (index) => {
      apiRef.current.setState((state) => ({
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          activeConversationIndex: index,
        },
      }));

      const conversation = gridAiAssistantActiveConversationSelector(apiRef);
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      return conversation;
    },
    [apiRef],
  );

  const setConversations = React.useCallback<GridAiAssistantApi['aiAssistant']['setConversations']>(
    (callback) => {
      if (!isAiAssistantAvailable) {
        return;
      }

      apiRef.current.setState((state) => ({
        ...state,
        aiAssistant: {
          ...state.aiAssistant,
          conversations:
            typeof callback === 'function' ? callback(state.aiAssistant?.conversations) : callback,
        },
      }));
    },
    [apiRef, isAiAssistantAvailable],
  );

  React.useEffect(() => {
    if (props.aiAssistantConversations) {
      setConversations(props.aiAssistantConversations);
    }
  }, [apiRef, props.aiAssistantConversations, setConversations]);

  React.useEffect(() => {
    if (props.aiAssistantPanelOpen) {
      setPanelOpen(props.aiAssistantPanelOpen);
    }
  }, [apiRef, props.aiAssistantPanelOpen, setPanelOpen]);

  React.useEffect(() => {
    if (props.aiAssistantActiveConversationIndex) {
      setActiveConversationIndex(props.aiAssistantActiveConversationIndex);
    }
  }, [apiRef, props.aiAssistantActiveConversationIndex, setActiveConversationIndex]);

  useGridApiMethod(
    apiRef,
    {
      aiAssistant: {
        processPrompt,
        setPanelOpen,
        setConversations,
        setActiveConversationIndex,
      },
    },
    'public',
  );
};
