import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';
import { gridSidebarStateSelector } from '../sidebar/gridSidebarSelector';
import { GridSidebarValue } from '../sidebar/gridSidebarInterfaces';
import type { GridComputedColumnDefinition } from './gridComputedColumnsInterfaces';

/**
 * Get the computed columns state.
 * @category Computed columns
 */
export const gridComputedColumnsStateSelector = createRootSelector(
  (state: GridStatePremium) => state.computedColumns,
);

/**
 * Get the computed columns model.
 * @category Computed columns
 */
export const gridComputedColumnsSelector = createSelector(
  gridComputedColumnsStateSelector,
  (computedColumnsState) => computedColumnsState.model,
);

/**
 * Get the revision of the computed results.
 * It changes whenever the computed cells must read their value again.
 * @category Computed columns
 */
export const gridComputedColumnsRevisionSelector = createSelector(
  gridComputedColumnsStateSelector,
  (computedColumnsState) => computedColumnsState.revision,
);

/**
 * Get the revision the cells of one column depend on: the revision of the computed
 * results for a computed column, a constant for every other column.
 * Subscribing to it re-renders the computed cells only.
 * @ignore - do not document.
 */
export const gridComputedColumnCellRevisionSelector = createSelector(
  gridColumnLookupSelector,
  gridComputedColumnsRevisionSelector,
  (lookup, revision, field: string) => (lookup[field]?.computed ? revision : 0),
);

/**
 * Get the definition of one computed column, or `null` when the field is not a computed column.
 * @category Computed columns
 */
export const gridComputedColumnDefinitionSelector = createSelector(
  gridComputedColumnsSelector,
  (model, field: string): GridComputedColumnDefinition | null =>
    model.find((definition) => definition.field === field) ?? null,
);

/**
 * Get whether the sidebar currently shows the computed columns panel.
 * @category Computed columns
 */
export const gridComputedColumnsPanelOpenSelector = createSelector(
  gridSidebarStateSelector,
  (sidebarState) => sidebarState.open && sidebarState.value === GridSidebarValue.ComputedColumns,
);
