import { GridColDef } from '@mui/x-data-grid';

export const DEFAULT_GRID_AUTOSIZE_OPTIONS = {
  includeHeaders: false,
  excludeOutliers: false,
  outliersFactor: 1.5,
};

export type GridAutosizeOptions = {
  /**
   * The columns to autosize. By default, applies to all columns.
   */
  columns?: GridColDef[];
  /**
   * If true, include the header widths in the calculation
   * @default false
   */
  includeHeaders?: boolean;
  /**
   * If true, width outliers will be ignored.
   * @default false
   */
  excludeOutliers?: boolean;
  /**
   * The IQR factor range to detect outliers.
   * @default 1.5
   */
  outliersFactor?: number;
};

/**
 * The Resize API interface that is available in the grid `apiRef`.
 */
export interface GridColumnResizeApi {
  /**
   * Auto-size the columns of the grid based on the cells' content and the space available.
   * @param {GridAutosizeOptions} options The autosizing options
   * @returns {Promise} A promise that resolves when autosizing is completed
   */
  autosizeColumns: (options?: GridAutosizeOptions) => Promise<void>;
}
