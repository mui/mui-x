import { GridStateColDef } from '../../../models/colDef/gridColDef';
import { createSelectorMemoized } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { gridVisibleColumnDefinitionsSelector } from '../columns';

/**
 * Get a list column definition
 */
export const gridListColumnSelector = (state: GridStateCommunity) => state.listView.listColumn;

/**
 * Get the visible list columns as a lookup, including the list column definition and actions.
 */
export const gridVisibleListColumnDefinitionsSelector = createSelectorMemoized(
  gridListColumnSelector,
  gridVisibleColumnDefinitionsSelector,
  (listColumn, visibleColumns) => {
    const visibleListColumns: GridStateColDef[] = [];

    if (listColumn) {
      visibleListColumns.push(listColumn);
    }

    const actionsColumn = visibleColumns.find((column) => column.type === 'actions');

    if (actionsColumn) {
      visibleListColumns.push(actionsColumn);
    }

    return visibleListColumns;
  },
);

/**
 * Get the field of each visible column.
 * @category Visible Columns
 */
export const gridVisibleListColumnFieldsSelector = createSelectorMemoized(
  gridVisibleListColumnDefinitionsSelector,
  (visibleColumns) => visibleColumns.map((column) => column.field),
);
