import {
  GridSortModel,
  GridFilterModel,
  GridColDef,
  GridRowModel,
  GridPaginationModel,
} from '@mui/x-data-grid';

interface GetRowsParams {
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
  /**
   * Alternate to `start` and `end`, maps to `GridPaginationModel` interface
   */
  paginationModel: GridPaginationModel;
  /**
   * First row index to fetch (number) or cursor information (number | string)
   */
  start: number | string; // first row index to fetch or cursor information
  /**
   * Last row index to fetch
   */
  end: number; // last row index to fetch
  /**
   * Array of keys returned by `getGroupKey` of all the parent rows until the row for which the data is requested
   * `getGroupKey` prop must be implemented to use this
   * Useful for `treeData` and `rowGrouping` only
   */
  groupKeys: string[];
  /**
   * List of grouped columns (only applicable with `rowGrouping`)
   */
  groupFields: GridColDef['field'][]; // list of grouped columns (`rowGrouping`)
}

interface GetRowsResponse {
  rows: GridRowModel[];
  /**
   * To reflect updates in total `rowCount` (optional)
   * Useful when the `rowCount` is inaccurate (e.g. when filtering) or not available upfront
   */
  rowCount?: number;
  /**
   * Additional `pageInfo` to help the grid determine if there are more rows to fetch (corner-cases)
   * `hasNextPage`: When row count is unknown/inaccurate, if `truncated` is set or rowCount is not known, data will keep loading until `hasNextPage` is `false`
   * `truncated`: To reflect `rowCount` is inaccurate (will trigger `x-y of many` in pagination after the count of rows fetched is greater than provided `rowCount`)
   * It could be useful with:
   * 1. Cursor based pagination:
   *   When rowCount is not known, grid will check for `hasNextPage` to determine
   *   if there are more rows to fetch.
   * 2. Inaccurate `rowCount`:
   *   `truncated: true` will let the grid know that `rowCount` is estimated/truncated.
   *   Thus `hasNextPage` will come into play to check more rows are available to fetch after the number becomes >= provided `rowCount`
   */
  pageInfo?: {
    hasNextPage?: boolean;
    truncated?: number;
  };
}

export interface DataSource {
  /**
    Fetcher Functions:
    - `getRows` is required
    - `updateRow` is optional
    
    `getRows` will be used by the grid to fetch data for the current page or children for the current parent group
    It may return a `rowCount` to update the total count of rows in the grid along with the optional `pageInfo`
  */
  getRows(params: GetRowsParams): Promise<GetRowsResponse>;
  updateRow?(rows: GridRowModel): Promise<any>;
}
