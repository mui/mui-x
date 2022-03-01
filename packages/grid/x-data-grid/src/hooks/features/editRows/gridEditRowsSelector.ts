import { GridStateCommunity } from '../../../models/gridStateCommunity';

// TODO v6: rename to gridEditingStateSelector
export const gridEditRowsStateSelector = (state: GridStateCommunity) => state.editRows;

/**
 * @ignore - do not document.
 */
export const gridEditingStateSelector = (state: GridStateCommunity) => state.editRows;
