import { GridColDef } from '@mui/x-data-grid';

/**
 * The Resize API interface that is available in the grid `apiRef`.
 */
export interface GridColumnResizeApi {
  autosizeColumns: (options: { columns?: GridColDef[]; includeHeader?: boolean }) => void;
}
