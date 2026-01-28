'use client';
import * as React from 'react';
import { type Plugin, createPlugin } from '../core/plugin';
import type { GridRowId } from '../internal/rows/rowUtils';
import { sortingSelectors } from './selectors';
import {
  getNextGridSortDirection,
  upsertSortModel,
  buildSortingApplier,
  applySortingToRowIds,
} from './utils';
import type {
  GridSortDirection,
  GridSortModel,
  GridSortItem,
  SortingState,
  SortingOptions,
  SortingInternalOptions,
  SortingApi,
  SortingColumnMeta,
} from './types';

type SortingPluginOptions = SortingOptions & SortingInternalOptions;

type SortingPlugin = Plugin<
  'sorting',
  SortingState,
  typeof sortingSelectors,
  SortingApi,
  SortingPluginOptions,
  SortingColumnMeta
>;

const DEFAULT_SORTING_ORDER: readonly GridSortDirection[] = ['asc', 'desc', null];

const sortingPlugin = createPlugin<SortingPlugin>()({
  name: 'sorting',
  selectors: sortingSelectors,

  getInitialState: (state, params) => {
    // Prefer controlled sortModel over initialState
    const initialSortModel =
      params.sortModel ?? params.initialState?.sorting?.sortModel ?? ([] as GridSortModel);

    const dataRowIds = state.rows.dataRowIds;
    let sortedRowIds: GridRowId[];

    if (params.externalSorting || params.sortingMode === 'manual') {
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
        sortModel: initialSortModel,
        getColumn,
        getRow,
      });
      sortedRowIds = applySortingToRowIds(dataRowIds, sortingApplier);
    }

    return {
      ...state,
      sorting: {
        sortModel: initialSortModel,
        sortedRowIds,
      },
    };
  },

  use: (store, params, api) => {
    const getDefaultSortingOrder = (): readonly GridSortDirection[] => {
      return params.sortingOrder ?? DEFAULT_SORTING_ORDER;
    };

    const isExternalSorting = (): boolean => {
      return params.externalSorting === true;
    };

    const isAutoMode = (): boolean => {
      return params.sortingMode !== 'manual';
    };

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
      const idsToSort = rowIds ?? api.rows.getAllRowIds();
      const modelToUse = sortModel ?? store.state.sorting.sortModel;
      const useStableSort = options?.stableSort ?? false;
      const currentIds = options?.currentSortedRowIds ?? store.state.sorting.sortedRowIds;

      const sortingApplier = buildSortingApplier({
        sortModel: modelToUse,
        getColumn,
        getRow: api.rows.getRow,
      });

      return applySortingToRowIds(idsToSort, sortingApplier, useStableSort, currentIds);
    };

    /**
     * Apply sorting and update state.
     * Uses computeSortedRowIds internally.
     */
    const applySorting = (): void => {
      // Skip if external sorting is enabled
      if (isExternalSorting()) {
        return;
      }

      const newSortedRowIds = computeSortedRowIds(undefined, undefined, {
        stableSort: params.stableSort ?? false,
      });

      // Update state
      store.setState({
        ...store.state,
        sorting: {
          ...store.state.sorting,
          sortedRowIds: newSortedRowIds,
        },
      });

      // Call callback
      params.onSortedRowsSet?.(newSortedRowIds);
    };

    const setSortModel = (model: GridSortModel): void => {
      const prevModel = store.state.sorting.sortModel;

      // Update state
      store.setState({
        ...store.state,
        sorting: {
          ...store.state.sorting,
          sortModel: model,
        },
      });

      // Call callback if model changed
      if (prevModel !== model) {
        params.onSortModelChange?.(model);
      }

      // Apply sorting in auto mode
      if (isAutoMode() && !isExternalSorting()) {
        applySorting();
      }
    };

    /**
     * Get the current sort model.
     */
    const getSortModel = (): GridSortModel => {
      return sortingSelectors.sortModel(store.state);
    };

    const sortColumn: SortingApi['sorting']['sortColumn'] = (field, direction, multiSort) => {
      const column = getColumn(field);

      if (column?.sortable === false) {
        return;
      }

      const sortModel = store.state.sorting.sortModel;
      const existingItem = sortModel.find((item) => item.field === field);

      // Determine the sort direction
      let newDirection: GridSortDirection;
      if (direction !== undefined) {
        newDirection = direction;
      } else {
        // Cycle through sortingOrder
        const columnSortingOrder = column?.sortingOrder ?? getDefaultSortingOrder();
        newDirection = getNextGridSortDirection(columnSortingOrder, existingItem?.sort);
      }

      const newSortItem: GridSortItem | undefined =
        newDirection === null ? undefined : { field, sort: newDirection };

      const shouldMultiSort = multiSort ?? params.enableMultiSort !== false;

      let newSortModel: GridSortModel;
      if (shouldMultiSort) {
        newSortModel = upsertSortModel(sortModel, field, newSortItem);
      } else {
        newSortModel = newSortItem ? [newSortItem] : [];
      }

      setSortModel(newSortModel);
    };

    // Track previous values for change detection
    // Initialize to current row IDs since initial sorting is done in getInitialState
    const prevRowIdsRef = React.useRef<GridRowId[]>(api.rows.getAllRowIds());
    const prevSortModelRef = React.useRef<GridSortModel>(store.state.sorting.sortModel);

    // Apply sorting when rows change (includes initial mount)
    React.useEffect(() => {
      const currentRowIds = api.rows.getAllRowIds();

      if (prevRowIdsRef.current !== currentRowIds) {
        prevRowIdsRef.current = currentRowIds;

        if (isExternalSorting()) {
          store.setState({
            ...store.state,
            sorting: {
              ...store.state.sorting,
              sortedRowIds: currentRowIds,
            },
          });
        } else if (isAutoMode()) {
          applySorting();
        }
      }
    });

    // Handle controlled sortModel prop changes
    React.useEffect(() => {
      if (params.sortModel !== undefined) {
        const currentModel = store.state.sorting.sortModel;
        if (params.sortModel !== currentModel && params.sortModel !== prevSortModelRef.current) {
          prevSortModelRef.current = params.sortModel;
          // Update state without triggering callback (it's controlled)
          store.setState({
            ...store.state,
            sorting: {
              ...store.state.sorting,
              sortModel: params.sortModel,
            },
          });

          if (isAutoMode() && !isExternalSorting()) {
            applySorting();
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only reacting to sortModel prop changes
    }, [params.sortModel]);

    return {
      sorting: {
        getSortModel,
        setSortModel,
        sortColumn,
        applySorting,
        computeSortedRowIds,
      },
    };
  },
});

export default sortingPlugin;
