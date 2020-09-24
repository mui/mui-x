import { RowData } from '../rows';

/**
 * Object passed as parameter as the selection change event handler.
 */
export interface SelectionChangeParams {
  /**
   * The set of rows that had their selection state change.
   */
  rows: RowData[];
}
