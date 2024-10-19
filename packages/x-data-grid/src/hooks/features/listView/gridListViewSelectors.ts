import { createSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { gridVisibleColumnDefinitionsSelector } from '../columns';

/**
 * Get a list column definition
 */
export const gridListColumnSelector = (state: GridStateCommunity) => state.listViewColumn;

export const gridListViewVisibleColumnSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  gridListColumnSelector,
  (visibleColumn, listViewColumn, listView) => {
    if (listView) {
      return [listViewColumn];
    }

    return visibleColumn;
  },
);
