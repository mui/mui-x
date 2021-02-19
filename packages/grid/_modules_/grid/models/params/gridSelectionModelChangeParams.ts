import { GridRowId } from '../gridRows';

/**
 * Object passed as parameter as the selection change event handler.
 */
export interface GridSelectionModelChangeParams {
  /**
   * The set of rows that had their selection state change.
   */
  selectionModel: GridRowId[];
}
