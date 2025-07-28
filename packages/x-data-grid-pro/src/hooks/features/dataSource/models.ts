import type {
  GridValidRowModel,
  GridRowId,
  GridGetRowsResponse,
  GridDataSource,
  GridGetRowsParams,
} from '@mui/x-data-grid';
import type { GridDataSourceApiBase } from '@mui/x-data-grid/internals';

export interface GridDataSourceState {
  loading: Record<GridRowId, boolean>;
  errors: Record<GridRowId, any>;
}

export interface GridGetRowsResponsePro extends GridGetRowsResponse {}

export interface GridGetRowsParamsPro extends GridGetRowsParams {
  /**
   * Array of keys returned by `getGroupKey()` of all the parent rows until the row for which the data is requested
   * `getGroupKey()` prop must be implemented to use this.
   * Used with "tree data" and "row grouping" features only.
   */
  groupKeys?: string[];
}

export interface GridDataSourcePro extends Omit<GridDataSource, 'getRows'> {
  /**
   * This method will be called when the grid needs to fetch some rows.
   * @param {GridGetRowsParamsPro} params The parameters required to fetch the rows.
   * @returns {Promise<GridGetRowsResponsePro>} A promise that resolves to the data of type [GridGetRowsResponsePro].
   */
  getRows(params: GridGetRowsParamsPro): Promise<GridGetRowsResponsePro>;
  /**
   * Used to group rows by their parent group.
   * Replaces `getTreeDataPath()` used in client side tree-data
   * Replaces `colDef.groupingValueGetter` used in client side row grouping
   *
   * @param {GridRowModel} row The row to get the group key of.
   * @returns {string} The group key for the row.
   * @example
   * // Simple data
   * getGroupKey: (row) => row.name
   *
   * @example
   * // Nested data
   * getGroupKey: (row) => row.user.firstName
   *
   * @example
   * // Complex data
   * getGroupKey: (row) => `${row.firstName}-${row.occupation}`
   */
  getGroupKey?: (row: GridValidRowModel) => string;
  /**
   * Used to update the group key of a row when it's moved to a different group. e.g by row reordering
   * This is the inverse operation of `getGroupKey()` and is done in order to sync the row with the server.
   *
   * @param {GridValidRowModel} row The row to update.
   * @param {string} groupKey The new group key for the row.
   * @returns {GridValidRowModel} The updated row with the new group key applied.
   * @example
   * // Simple data
   * setGroupKey: (row, groupKey) => ({ ...row, name: groupKey })
   *
   * @example
   * // Nested data
   * setGroupKey: (row, groupKey) => ({
   *   ...row, user: { ...row.user, firstName: groupKey }
   * })
   *
   * @example
   * // Complex data
   * setGroupKey: (row, groupKey) => {
   *   const [firstName, occupation] = groupKey.split('-');
   *   return { ...row, firstName, occupation };
   * }
   */
  setGroupKey?: (row: GridValidRowModel, groupKey: string) => GridValidRowModel;
  /**
   * Used to determine the number of children a row has on server.
   * @param {GridRowModel} row The row to check the number of children.
   * @returns {number} The number of children the row has.
   * If the children count is not available for some reason, but there are some children, `getChildrenCount` should return `-1`.
   */
  getChildrenCount?: (row: GridValidRowModel) => number;
}

export interface GridDataSourceApiBasePro extends Omit<GridDataSourceApiBase, 'fetchRows'> {
  /**
   * Fetches the rows from the server.
   * If no `parentId` option is provided, it fetches the root rows.
   * Any missing parameter from `params` will be filled from the state (sorting, filtering, etc.).
   * @param {GridRowId} parentId The id of the parent node (default: `GRID_ROOT_GROUP_ID`).
   * @param {Partial<GridGetRowsParamsPro>} params Request parameters override.
   */
  fetchRows: (parentId?: GridRowId, params?: Partial<GridGetRowsParamsPro>) => void;
  /**
   * Set the loading state of a parent row.
   * @param {string} parentId The id of the parent node.
   * @param {boolean} loading The loading state to set.
   */
  setChildrenLoading: (parentId: GridRowId, loading: boolean) => void;
  /**
   * Set error occured while fetching the children of a row.
   * @param {string} parentId The id of the parent node.
   * @param {Error} error The error of type `Error` or `null`.
   */
  setChildrenFetchError: (parentId: GridRowId, error: Error | null) => void;
}

export interface GridDataSourceApiPro {
  /**
   * The data source API.
   */
  dataSource: GridDataSourceApiBasePro;
}

export interface GridDataSourcePrivateApiPro {
  /**
   * Initiates the fetch of the children of a row.
   * @param {string} id The id of the group to be fetched.
   */
  fetchRowChildren: (id: GridRowId) => void;
  /**
   * Resets the data source state.
   */
  resetDataSourceState: () => void;
}
