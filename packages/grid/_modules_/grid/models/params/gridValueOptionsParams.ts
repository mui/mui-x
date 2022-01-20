import { GridRowModel, GridRowId } from '../gridRows';

/**
 * Object passed as parameter of the valueOptions function for singleSelect column.
 */
export interface GridValueOptionsParams {
  /**
   * The field of the column to which options will be provided
   */
  field: string;
  /**
   * The grid row id.
   */
  id?: GridRowId;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row?: GridRowModel;
}
