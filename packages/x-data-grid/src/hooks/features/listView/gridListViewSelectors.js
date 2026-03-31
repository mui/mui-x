import { createRootSelector } from '../../../utils/createSelector';
/**
 * Get the list view state
 * @category List View
 * @ignore - Do not document
 */
export const gridListViewSelector = createRootSelector((state) => state.props.listView ?? false);
/**
 * Get the list column definition
 * @category List View
 * @ignore - Do not document
 */
export const gridListColumnSelector = createRootSelector((state) => state.listViewColumn);
