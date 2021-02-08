import { RowId } from '../rows';

/**
 * Object passed as parameter as the selection change event handler.
 */
export interface SelectionModelChangeParams {
  /**
   * The set of rows that had their selection state change.
   */
  selectionModel: RowId[];
}
