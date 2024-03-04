import { GridRowId } from '@mui/x-data-grid';

/**
 * The dataSource API interface that is available in the grid [[apiRef]].
 */
export interface GridDataSourceApi {
  /**
   * Initiates the fetch of the children of a row.
   * @param {string} id The id of the rowNode belonging to the group to be fetched.
   */
  fetchRowChildren: (id: GridRowId) => void;
  /**
   * Set the loading state of a row.
   * @param {string} id The id of the rowNode.
   * @param {boolean} loading The loading state to set.
   */
  setRowLoading: (id: GridRowId, loading: boolean) => void;
  /**
   * Set the fetched children state of a row.
   * @param {string} id The id of the rowNode.
   * @param {boolean} childrenFetched The children to set.
   */
  setChildrenFetched: (id: GridRowId, childrenFetched: boolean) => void;
}
