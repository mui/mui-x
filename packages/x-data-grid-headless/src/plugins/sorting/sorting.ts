'use client';
import * as React from 'react';
import { type Plugin, createPlugin } from '../core/plugin';
import type { GridRowId } from '../internal/rows/rowUtils';
import { sortingSelectors } from './selectors';
import { getNextGridSortDirection, upsertSortModel, buildSortingApplier } from './sortingUtils';
import type {
  GridSortDirection,
  GridSortModel,
  GridSortItem,
  SortingState,
  SortingOptions,
  SortingInternalOptions,
  SortingApi,
  SortingColumnMeta,
  SortingSelectors,
} from './types';

type SortingPluginOptions = SortingOptions & SortingInternalOptions;

type SortingPlugin = Plugin<
  'sorting',
  SortingState,
  SortingSelectors,
  SortingApi,
  SortingPluginOptions,
  SortingColumnMeta
>;

const DEFAULT_SORTING_ORDER: readonly GridSortDirection[] = ['asc', 'desc', null];

// TODO: Set priority on the whole plugin instead of the processor?
const SORTING_PIPELINE_PRIORITY = 100;

const sortingPlugin = createPlugin<SortingPlugin>()({
  name: 'sorting',
  selectors: sortingSelectors,

  initialize: (state, params) => {
    // Prefer controlled sortModel over initialState
    const initialSortModel =
      params.sorting?.model ?? params.initialState?.sorting?.model ?? ([] as GridSortModel);

    const dataRowIds = state.rows.dataRowIds;
    let sortedRowIds: GridRowId[];

    if (params.sorting?.external || params.sorting?.mode === 'manual') {
      // For external/manual sorting, just mirror the row order
      sortedRowIds = dataRowIds;
    } else {
      // Auto mode: compute sorted row IDs synchronously to avoid a flash of unsorted content
      const getColumn = (field: string) =>
        state.columns.lookup[field] as
          | ((typeof state.columns.lookup)[string] & SortingColumnMeta)
          | undefined;
      const getRow = (id: GridRowId) => state.rows.dataRowIdToModelLookup[id];

      const sortingApplier = buildSortingApplier({
        model: initialSortModel,
        getColumn,
        getRow,
        locale: params.intl?.locale,
      });
      sortedRowIds = sortingApplier ? sortingApplier(dataRowIds) : dataRowIds;
    }

    return {
      ...state,
      rows: {
        ...state.rows,
        processedRowIds: sortedRowIds,
      },
      sorting: {
        model: initialSortModel,
      },
    };
  },

  use: (store, params, api) => {
    const getDefaultSortingOrder = (): readonly GridSortDirection[] => {
      return params.sorting?.order ?? DEFAULT_SORTING_ORDER;
    };

    const isExternalSorting = params.sorting?.external === true;

    const isAutoMode = params.sorting?.mode !== 'manual';

    const getColumn = (field: string) => {
      // Cast to include SortingColumnMeta since we're in the sorting plugin
      return api.columns.get(field) as
        | (ReturnType<typeof api.columns.get> & SortingColumnMeta)
        | undefined;
    };

    const computeSortedRowIds: SortingApi['sorting']['computeSortedRowIds'] = (
      rowIds,
      sortModel,
      options,
    ) => {
      const originalRowIds = rowIds ?? api.rows.getAllRowIds();
      const modelToUse = sortModel ?? store.state.sorting.model;
      const useStableSort = options?.stableSort ?? false;
      const currentSortedRowIds = options?.currentSortedRowIds ?? store.state.rows.processedRowIds;

      const sortingApplier = buildSortingApplier({
        model: modelToUse,
        getColumn,
        getRow: api.rows.getRow,
        locale: params.intl?.locale,
      });

      if (!useStableSort || !currentSortedRowIds) {
        return sortingApplier ? sortingApplier(originalRowIds) : originalRowIds;
      }

      // Stable sort: use the current sorted order as the base,
      // filtering to only include IDs that still exist, and appending any new IDs.
      const rowIdSet = new Set(originalRowIds);
      const idsToSort = currentSortedRowIds.filter((id) => rowIdSet.has(id));

      const currentIdSet = new Set(currentSortedRowIds);
      originalRowIds.forEach((id) => {
        if (!currentIdSet.has(id)) {
          idsToSort.push(id);
        }
      });

      return sortingApplier ? sortingApplier(idsToSort) : idsToSort;
    };

    const sortingProcessor = React.useCallback(
      (inputIds: GridRowId[]): GridRowId[] => {
        if (isExternalSorting) {
          return inputIds;
        }
        return computeSortedRowIds(inputIds, store.state.sorting.model, {
          stableSort: params.sorting?.stableSort ?? false,
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps -- functions access store.state at call time
      [params.sorting?.stableSort],
    );

    /**
     * Apply sorting and update state.
     * Uses computeSortedRowIds internally.
     */
    const applySorting = (): void => {
      // Skip if external sorting is enabled
      if (isExternalSorting) {
        return;
      }

      if (!isAutoMode) {
        const unregister = api.rows.rowIdsPipeline.register(
          'sorting',
          SORTING_PIPELINE_PRIORITY,
          sortingProcessor,
        );
        api.rows.rowIdsPipeline.recompute();
        unregister();
      } else {
        api.rows.rowIdsPipeline.recompute();
      }
    };

    const setSortModel = (model: GridSortModel): void => {
      const prevModel = store.state.sorting.model;

      // Update state
      store.setState({
        ...store.state,
        sorting: {
          ...store.state.sorting,
          model,
        },
      });

      // Call callback if model changed
      if (prevModel !== model) {
        params.sorting?.onModelChange?.(model);
      }

      // Apply sorting in auto mode
      if (isAutoMode && !isExternalSorting) {
        applySorting();
      }
    };

    /**
     * Get the current sort model.
     */
    const getSortModel = (): GridSortModel => {
      return sortingSelectors.model(store.state);
    };

    const sortColumn: SortingApi['sorting']['sortColumn'] = (field, direction, multiSort) => {
      const column = getColumn(field);

      if (column?.sortable === false) {
        return;
      }

      const sortModel = store.state.sorting.model;
      const existingItem = sortModel.find((item) => item.field === field);

      // Determine the sort direction
      let newDirection: GridSortDirection;
      if (direction !== undefined) {
        newDirection = direction;
      } else {
        // Cycle through sortingOrder
        const columnSortingOrder = column?.sortingOrder ?? getDefaultSortingOrder();
        newDirection = getNextGridSortDirection(columnSortingOrder, existingItem?.direction);
      }

      const newSortItem: GridSortItem | undefined =
        newDirection === null ? undefined : { field, direction: newDirection };

      const shouldMultiSort = multiSort ?? params.sorting?.multiSort !== false;

      let newSortModel: GridSortModel;
      if (shouldMultiSort) {
        newSortModel = upsertSortModel(sortModel, field, newSortItem);
      } else {
        newSortModel = newSortItem ? [newSortItem] : [];
      }

      setSortModel(newSortModel);
    };

    React.useEffect(() => {
      if (!isAutoMode) {
        return undefined;
      }
      return api.rows.rowIdsPipeline.register(
        'sorting',
        SORTING_PIPELINE_PRIORITY,
        sortingProcessor,
      );
    }, [api, sortingProcessor, isAutoMode]);

    // Initialize to current row IDs since initial sorting is done in initialize
    const prevSortModelRef = React.useRef<GridSortModel>(store.state.sorting.model);

    // Handle controlled sorting.model prop changes
    React.useEffect(() => {
      if (params.sorting?.model !== undefined) {
        const currentModel = store.state.sorting.model;
        if (
          params.sorting.model !== currentModel &&
          params.sorting.model !== prevSortModelRef.current
        ) {
          prevSortModelRef.current = params.sorting.model;
          // Update state without triggering callback (it's controlled)
          store.setState({
            ...store.state,
            sorting: {
              ...store.state.sorting,
              model: params.sorting.model,
            },
          });

          if (isAutoMode && !isExternalSorting) {
            applySorting();
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only reacting to sorting.model prop changes
    }, [params.sorting?.model]);

    return {
      sorting: {
        getModel: getSortModel,
        setModel: setSortModel,
        sortColumn,
        apply: applySorting,
        computeSortedRowIds,
      },
    };
  },
});

export default sortingPlugin;
