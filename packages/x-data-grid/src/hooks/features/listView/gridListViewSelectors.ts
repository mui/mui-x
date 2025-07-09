import { createRootSelector } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

/**
 * Get the list view state
 * @category List View
 * @ignore - Do not document
 */
export const gridListViewSelector = createRootSelector(
  (state: GridStateCommunity) => state.props.listView ?? false,
);

/**
 * Get the list column definition
 * @category List View
 * @ignore - Do not document
 */
export const gridListColumnSelector = createRootSelector(
  (state: GridStateCommunity) => state.listViewColumn,
);
