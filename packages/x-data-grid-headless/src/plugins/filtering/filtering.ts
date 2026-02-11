'use client';
import * as React from 'react';
import { type Plugin, createPlugin } from '../core/plugin';
import type { GridRowId } from '../internal/rows/rowUtils';
import { filteringSelectors } from './selectors';
import { buildFilterApplier } from './filteringUtils';
import type {
  FilterModel,
  FilteringState,
  FilteringOptions,
  FilteringInternalOptions,
  FilteringApi,
  FilteringColumnMeta,
  FilteringSelectors,
} from './types';
import { EMPTY_FILTER_MODEL } from './types';
import type sortingPlugin from '../sorting/sorting';

type FilteringPluginOptions = FilteringOptions & FilteringInternalOptions;

type FilteringPlugin = Plugin<
  'filtering',
  FilteringState,
  FilteringSelectors,
  FilteringApi,
  FilteringPluginOptions,
  FilteringColumnMeta
>;

const filteringPlugin = createPlugin<FilteringPlugin>()({
  name: 'filtering',
  selectors: filteringSelectors,

  initialize: (state, params) => {
    // Prefer controlled model over initialState
    const initialModel =
      params.filtering?.model ??
      params.initialState?.filtering?.model ??
      EMPTY_FILTER_MODEL;

    // Determine input rows: use sorted row IDs if sorting plugin has already initialized
    const inputRowIds =
      (state as any).sorting?.sortedRowIds ?? state.rows.dataRowIds;

    let filteredRowIds: GridRowId[];

    if (params.filtering?.external || params.filtering?.mode === 'manual') {
      // For external/manual filtering, just mirror the input row order
      filteredRowIds = inputRowIds;
    } else {
      // Auto mode: compute filtered row IDs synchronously to avoid a flash of unfiltered content
      const getColumn = (field: string) =>
        state.columns.lookup[field] as
          | ((typeof state.columns.lookup)[string] & FilteringColumnMeta)
          | undefined;
      const getRow = (id: GridRowId) => state.rows.dataRowIdToModelLookup[id];

      const filterApplier = buildFilterApplier({
        model: initialModel,
        getColumn,
        getRow,
        disableEval: params.filtering?.disableEval,
      });
      filteredRowIds = filterApplier ? filterApplier(inputRowIds) : inputRowIds;
    }

    return {
      ...state,
      filtering: {
        model: initialModel,
        filteredRowIds,
      },
    };
  },

  use: (store, params, api) => {
    const isExternalFiltering = (): boolean => {
      return params.filtering?.external === true;
    };

    const isAutoMode = (): boolean => {
      return params.filtering?.mode !== 'manual';
    };

    const getColumn = (field: string) => {
      return api.columns.get(field) as
        | (ReturnType<typeof api.columns.get> & FilteringColumnMeta)
        | undefined;
    };

    /**
     * Get the input row IDs to filter.
     * Uses sorted row IDs if sorting plugin is present, otherwise raw row IDs.
     */
    const getInputRowIds = (): GridRowId[] => {
      if (api.pluginRegistry.hasPlugin<typeof sortingPlugin>(api, 'sorting')) {
        return (store.state as any).sorting.sortedRowIds;
      }
      return store.state.rows.dataRowIds;
    };

    const computeFilteredRowIds: FilteringApi['filtering']['computeFilteredRowIds'] = (
      rowIds,
      filterModel,
    ) => {
      const originalRowIds = rowIds ?? getInputRowIds();
      const modelToUse = filterModel ?? store.state.filtering.model;

      const filterApplier = buildFilterApplier({
        model: modelToUse,
        getColumn,
        getRow: api.rows.getRow,
        disableEval: params.filtering?.disableEval,
      });

      return filterApplier ? filterApplier(originalRowIds) : originalRowIds;
    };

    /**
     * Apply filtering and update state.
     */
    const applyFiltering = (): void => {
      if (isExternalFiltering()) {
        return;
      }

      const newFilteredRowIds = computeFilteredRowIds();

      store.setState({
        ...store.state,
        filtering: {
          ...store.state.filtering,
          filteredRowIds: newFilteredRowIds,
        },
      });
    };

    const setModel = (model: FilterModel): void => {
      const prevModel = store.state.filtering.model;

      store.setState({
        ...store.state,
        filtering: {
          ...store.state.filtering,
          model,
        },
      });

      if (prevModel !== model) {
        params.filtering?.onModelChange?.(model);
      }

      if (isAutoMode() && !isExternalFiltering()) {
        applyFiltering();
      }
    };

    const getModel = (): FilterModel => {
      return filteringSelectors.model(store.state);
    };

    // Track previous input row IDs to detect changes
    const prevInputRowIdsRef = React.useRef<GridRowId[]>(getInputRowIds());
    const prevFilterModelRef = React.useRef<FilterModel>(store.state.filtering.model);

    // Subscribe to store changes to detect when input rows change (sorted or raw).
    // We use store.subscribe instead of a React effect because the component may not
    // re-render when sortedRowIds change (it subscribes to filteredRowIds, not sortedRowIds).
    React.useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        const currentInputRowIds = getInputRowIds();

        if (prevInputRowIdsRef.current !== currentInputRowIds) {
          prevInputRowIdsRef.current = currentInputRowIds;

          if (isExternalFiltering()) {
            store.setState({
              ...store.state,
              filtering: {
                ...store.state.filtering,
                filteredRowIds: currentInputRowIds,
              },
            });
          } else if (isAutoMode()) {
            applyFiltering();
          }
        }
      });
      return unsubscribe;
      // eslint-disable-next-line react-hooks/exhaustive-deps -- subscribe once on mount
    }, []);

    // Handle controlled filtering.model prop changes
    React.useEffect(() => {
      if (params.filtering?.model !== undefined) {
        const currentModel = store.state.filtering.model;
        if (
          params.filtering.model !== currentModel &&
          params.filtering.model !== prevFilterModelRef.current
        ) {
          prevFilterModelRef.current = params.filtering.model;
          store.setState({
            ...store.state,
            filtering: {
              ...store.state.filtering,
              model: params.filtering.model,
            },
          });

          if (isAutoMode() && !isExternalFiltering()) {
            applyFiltering();
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only reacting to filtering.model prop changes
    }, [params.filtering?.model]);

    return {
      filtering: {
        getModel,
        setModel,
        apply: applyFiltering,
        computeFilteredRowIds,
      },
    };
  },
});

export default filteringPlugin;
