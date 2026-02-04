import type {
  GridValidRowModel,
  GridRowId,
  GridGetRowsResponse,
  GridDataSource,
  GridGetRowsParams,
} from '@mui/x-data-grid';
import type {
  GridDataSourceApiBase,
  GridDataSourceFetchRowsParams,
} from '@mui/x-data-grid/internals';

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
   * @param {GridRowModel} row The row to get the group key of.
   * @returns {string} The group key for the row.
   */
  getGroupKey?: (row: GridValidRowModel) => string;
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
   * @param {GridDataSourceFetchRowsParams<GridGetRowsParamsPro>} params Request parameters override.
   * @returns {Promise<void>} A promise that resolves when the rows are fetched.
   */
  fetchRows: (
    parentId?: GridRowId,
    params?: GridDataSourceFetchRowsParams<GridGetRowsParamsPro>,
  ) => Promise<void>;
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
  /**
   * Removes the children rows of a parent from the grid.
   * This is used when collapsing a parent row to ensure dynamic data updates work properly.
   * @param {GridRowId} parentId The id of the parent node.
   */
  removeChildrenRows: (parentId: GridRowId) => void;
}
