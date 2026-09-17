import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';
import { gridSidebarStateSelector } from '../sidebar/gridSidebarSelector';
import { GridSidebarValue } from '../sidebar/gridSidebarInterfaces';
import type { GridComputedColumnDefinition } from './gridComputedColumnsInterfaces';

export const gridComputedColumnsStateSelector = createRootSelector(
  (state: GridStatePremium) => state.computedColumns,
);

/**
 * Get the computed columns model.
 */
export const gridComputedColumnsSelector = createSelector(
  gridComputedColumnsStateSelector,
  (computedColumnsState) => computedColumnsState.model,
);

/**
 * Get the revision of the computed results.
 * It changes whenever the computed cells must read their value again.
 */
export const gridComputedColumnsRevisionSelector = createSelector(
  gridComputedColumnsStateSelector,
  (computedColumnsState) => computedColumnsState.revision,
);

/**
 * Get the definition of one computed column, or `null` when the field is not a computed column.
 */
export const gridComputedColumnDefinitionSelector = createSelector(
  gridComputedColumnsSelector,
  (model, field: string): GridComputedColumnDefinition | null =>
    model.find((definition) => definition.field === field) ?? null,
);

/**
 * Get whether the sidebar currently shows the computed columns panel.
 */
export const gridComputedColumnsPanelOpenSelector = createSelector(
  gridSidebarStateSelector,
  (sidebarState) => sidebarState.open && sidebarState.value === GridSidebarValue.ComputedColumns,
);
