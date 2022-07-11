import { GridColumnGroupLookup } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { GridColumnGroup } from '../gridColumnGrouping';

/**
 * The column grouping API interface that is available in the grid [[apiRef]].
 */
export interface GridColumnGroupingApi {
  /**
   * Returns the id of the groups leading to the requested column.
   * The array is ordered by increasing depth (the last element is the direct parent of the column).
   * @param {string} field The field of of the column requested.
   * @returns {string[]} The id of the groups leading to the requested column.
   
   * @param {string} field The id of of the column requested.
   * @returns {string[]} array of groupId.
   */
  getColumnGroupPath: (field: string) => GridColumnGroup['groupId'][];
  /**
   * Returns the details of the requested group.
   * @param {string} groupId The id of the group requested.
   * @returns {Omit<GridColumnGroup, 'children'>} The group details.
   */
  getGroupDetails: (groupId: string) => Omit<GridColumnGroup, 'children'> | null;
  /**
   * Returns the column group lookup.
   * @returns {GridColumnGroupLookup} The column group lookup.
   */
  getAllGroupDetails: () => GridColumnGroupLookup;
}
