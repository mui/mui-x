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

// Re-export types
export type {
  GridSortDirection,
  GridSortModel,
  GridSortItem,
  GridComparatorFn,
  GridComparatorFnFactory,
  GridSortCellParams,
  SortingState,
  SortingOptions,
  SortingApi,
  SortingColumnMeta,
  SortColumnLookup,
  SortingSelectors,
} from './types';

// Re-export utilities
export {
  gridStringOrNumberComparator,
  gridNumberComparator,
  gridDateComparator,
  getNextGridSortDirection,
} from './utils';

// Re-export selectors
export { sortingSelectors } from './selectors';

// ================================
// Plugin Options Type (combined)
// ================================

type SortingPluginOptions = SortingOptions & SortingInternalOptions;

// ================================
// Default Values
// ================================

const DEFAULT_SORTING_ORDER: readonly GridSortDirection[] = ['asc', 'desc', null];

// ================================
// Plugin Definition
// ================================

type SortingPlugin = Plugin<
  'sorting',
  SortingState,
  SortingApi,
  SortingPluginOptions,
  SortingColumnMeta
>;

const sortingPlugin = createPlugin<SortingPlugin>()({
  name: 'sorting',

  getInitialState: (state, params) => {
    // Prefer controlled sortModel over initialState
    const initialSortModel =
      params.sortModel ?? params.initialState?.sorting?.sortModel ?? ([] as GridSortModel);

    return {
      ...state,
      sorting: {
        sortModel: initialSortModel,
        sortedRowIds: [], // Will be computed on first applySorting
      },
    };
  },

  use: (store, params, api) => {
    // ================================
    // Internal Helpers
    // ================================

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
      // Cast to include SortingColumnMeta since we're the sorting plugin
      return api.columns.get(field) as
        | (ReturnType<typeof api.columns.get> & SortingColumnMeta)
        | undefined;
    };

    const getRow = (id: GridRowId) => {
      return api.rows.getRow(id);
    };

    const getAllRowIds = (): GridRowId[] => {
      return api.rows.getAllRowIds();
    };

    // ================================
    // Core API Methods
    // ================================

    /**
     * Compute sorted row IDs without updating state.
     */
    const computeSortedRowIds = (
      rowIds?: GridRowId[],
      sortModel?: GridSortModel,
    ): GridRowId[] => {
      const idsToSort = rowIds ?? getAllRowIds();
      const modelToUse = sortModel ?? store.state.sorting.sortModel;

      const sortingApplier = buildSortingApplier({
        sortModel: modelToUse,
        getColumn,
        getRow,
      });

      if (!sortingApplier) {
        return idsToSort;
      }

      return sortingApplier(idsToSort);
    };

    /**
     * Apply sorting and update state.
     */
    const applySorting = (): void => {
      // Skip if external sorting is enabled
      if (isExternalSorting()) {
        return;
      }

      const rowIds = getAllRowIds();
      const { sortModel, sortedRowIds: currentSortedRowIds } = store.state.sorting;

      const sortingApplier = buildSortingApplier({
        sortModel,
        getColumn,
        getRow,
      });

      const newSortedRowIds = applySortingToRowIds(
        rowIds,
        sortingApplier,
        params.stableSort ?? false,
        currentSortedRowIds,
      );

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

    /**
     * Set the sort model.
     */
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
      return store.state.sorting.sortModel;
    };

    /**
     * Sort a column.
     */
    const sortColumn = (
      field: string,
      direction?: GridSortDirection,
      multiSort?: boolean,
    ): void => {
      const column = getColumn(field);
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

      // Create the new sort item
      const newSortItem: GridSortItem | undefined =
        newDirection === null ? undefined : { field, sort: newDirection };

      // Determine if we should do multi-sort
      const shouldMultiSort = multiSort ?? (params.enableMultiSort !== false);

      let newSortModel: GridSortModel;
      if (shouldMultiSort) {
        // Add/update/remove in the existing model
        newSortModel = upsertSortModel(sortModel, field, newSortItem);
      } else {
        // Replace the entire model
        newSortModel = newSortItem ? [newSortItem] : [];
      }

      setSortModel(newSortModel);
    };

    // ================================
    // Effects for Auto Mode
    // ================================

    // Track previous values for change detection
    const prevRowIdsRef = React.useRef<GridRowId[]>([]);
    const prevSortModelRef = React.useRef<GridSortModel>(store.state.sorting.sortModel);
    const initializedRef = React.useRef(false);

    // Initial sorting on mount
    React.useEffect(() => {
      if (!initializedRef.current) {
        initializedRef.current = true;

        if (isExternalSorting()) {
          // For external sorting, just mirror the row order
          const rowIds = getAllRowIds();
          store.setState({
            ...store.state,
            sorting: {
              ...store.state.sorting,
              sortedRowIds: rowIds,
            },
          });
        } else {
          // Apply initial sorting
          applySorting();
        }
      }
    });

    // Re-apply sorting when rows change (auto mode only)
    React.useEffect(() => {
      if (!initializedRef.current) {
        return;
      }

      const currentRowIds = getAllRowIds();

      if (prevRowIdsRef.current !== currentRowIds) {
        prevRowIdsRef.current = currentRowIds;

        if (isExternalSorting()) {
          // For external sorting, mirror the row order
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

    // ================================
    // Return API
    // ================================

    return {
      sorting: {
        getSortModel,
        setSortModel,
        sortColumn,
        applySorting,
        computeSortedRowIds,
        selectors: sortingSelectors,
      },
    };
  },
});

export default sortingPlugin;
