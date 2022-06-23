import { GridColumnGroupLookup } from '@mui/x-data-grid/hooks/features/columns/gridColumnsInterfaces';
import { GridColumnGroup } from '../gridColumnGrouping';

/**
 * The column grouping API interface that is available in the grid [[apiRef]].
 */
export interface GridColumnGroupingApi {
  /**
   * Returns the array of groupId applied on the column `field`.
   * @param {string} field The id of of the column requested.
   * @returns {string[]} array of groupId.
   */
  getColumnGroupPath: (field: string) => GridColumnGroup['groupId'][];
  /**
   * Returns the details about a group corresponding to `groupId`.
   * @param {string} groupId The id of the group requested.
   * @returns {Omit<GridColumnGroup, 'children'>} group details.
   */
  getGroupDetails: (groupId: string) => Omit<GridColumnGroup, 'children'> | null;
  /**
   * Returns the column group lookup.
   * @returns {GridColumnGroupLookup} groupsLookup.
   */
  getAllGroupDetails: () => GridColumnGroupLookup;
}
