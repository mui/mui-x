import { GridColDef } from '@mui/x-data-grid';

/**
 * The Resize API interface that is available in the grid `apiRef`.
 */
export interface GridColumnResizeApi {
  /**
   * Auto-size the columns of the grid based on the cells' content and the space available.
   */
  autosizeColumns: (options?: { columns?: GridColDef[]; includeHeader?: boolean }) => void;
}
