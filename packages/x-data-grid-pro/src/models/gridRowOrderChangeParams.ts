import { GridRowModel, GridRowId } from '@mui/x-data-grid';

/**
 * Object passed as parameter of the row order change event.
 * @demos
 *   - [Flat row reordering](/x/react-data-grid/row-ordering/#implementing-row-reordering)
 *   - [Tree data reordering](/x/react-data-grid/tree-data/#drag-and-drop-tree-data-reordering)
 *   - [Row grouping reordering](/x/react-data-grid/row-grouping/#drag-and-drop-group-reordering)
 */
export interface GridRowOrderChangeParams {
  /**
   * The row data of the primary row being moved.
   * For group moves, this represents the group row itself.
   * Descendants move should be handled as data updates. e.g. using `processRowUpdate()`
   */
  row: GridRowModel;
  /**
   * The old index of the row.
   * - For flat data: Position in the flat array.
   * - For nested data: Position within oldParent's children array (0-based).
   */
  oldIndex: number;
  /**
   * The target index of the row.
   * - For flat data: New position in the flat array.
   * - For nested data: Position within newParent's children array (0-based).
   */
  targetIndex: number;
  /**
   * The parent row ID before the move.
   * - For flat data: `null`
   * - For nested row at root level: `null`.
   * - For nested row at levels below root: Parent row's ID.
   */
  oldParent: GridRowId | null;
  /**
   * The parent row ID after the move.
   * - For flat data: `null`.
   * - For nested row at root level: `null`.
   * - For nested row at levels below root: Parent row's ID.
   */
  newParent: GridRowId | null;
}
