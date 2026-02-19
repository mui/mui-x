import { createSelector, createSelectorMemoized } from '@base-ui/utils/store';
import type { ColumnsPluginState } from './types';

const selectOrderedFields = createSelector(
  (state: ColumnsPluginState) => state.columns.orderedFields,
);

const selectLookup = createSelector((state: ColumnsPluginState) => state.columns.lookup);

const selectColumnVisibilityModel = createSelector(
  (state: ColumnsPluginState) => state.columns.columnVisibilityModel,
);

const selectInitialColumnVisibilityModel = createSelector(
  (state: ColumnsPluginState) => state.columns.initialColumnVisibilityModel,
);

const selectAllColumns = createSelectorMemoized(
  selectOrderedFields,
  selectLookup,
  (orderedFields, lookup) => orderedFields.map((field) => lookup[field]).filter(Boolean),
);

const selectVisibleColumns = createSelectorMemoized(
  selectOrderedFields,
  selectLookup,
  selectColumnVisibilityModel,
  (orderedFields, lookup, columnVisibilityModel, includeCollapsed: boolean = true) =>
    orderedFields
      .filter((field) => {
        const state = columnVisibilityModel[field];
        if (state === 'hidden') {
          return false;
        }
        if (!includeCollapsed && state === 'collapsed') {
          return false;
        }
        return true;
      })
      .map((field) => lookup[field])
      .filter(Boolean),
);

const selectColumn = createSelector(selectLookup, (lookup, field: string) => lookup[field]);

export const columnsSelectors = {
  orderedFields: selectOrderedFields,
  lookup: selectLookup,
  columnVisibilityModel: selectColumnVisibilityModel,
  initialColumnVisibilityModel: selectInitialColumnVisibilityModel,
  allColumns: selectAllColumns,
  visibleColumns: selectVisibleColumns,
  column: selectColumn,
};
