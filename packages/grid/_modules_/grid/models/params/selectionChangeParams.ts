import { RowId } from '../rows';

/**
 * Object passed as parameter as the selection change event handler.
 */
export interface SelectionChangeParams {
  /**
   * The set of rows that had their selection state change.
   */
  rowIds: RowId[];
}
