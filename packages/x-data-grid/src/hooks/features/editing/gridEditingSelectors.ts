import { GridApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * Select the row editing state.
 */
export const gridEditRowsStateSelector = (apiRef: React.RefObject<GridApiCommunity>) =>
  apiRef.current.state.editRows;
