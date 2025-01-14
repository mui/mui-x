import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * Get the list column definition
 * @category List View
 * @ignore - Do not document
 */
export const gridListColumnSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.listViewColumn;
