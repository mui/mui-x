import { GridTreeNode } from '@mui/x-data-grid';

/**
 * The API for tree data lazy loading.
 */
export interface GridTreeDataLazyLoadingApi {
  /**
   * Sets the loading status of a server side row.
   * @param {GridTreeNode['id']} nodeId The id of the node.
   * @param {boolean} value The boolean value that's needs to be set.
   */
  setRowLoadingStatus: (nodeId: GridTreeNode['id'], value: boolean) => void;
}
