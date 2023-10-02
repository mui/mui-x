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
  groupKeys: string[]; // array of keys returned by `getGroupKey` of all the parent rows until the row for which the data is requested
  paginationModel: GridPaginationModel; // alternate to `start`, `end`
  start: number | string; // first row index to fetch or cursor information
  end: number; // last row index to fetch
  groupFields: GridColDef['field'][]; // list of grouped columns (`rowGrouping`)
}

interface GetRowsResponse {
  rows: GridRowModel[];
  rowCount?: number; // optional: to reflect updates in total `rowCount`
  pageInfo?: {
    hasNextPage?: boolean; // optional: when row count is unknown/inaccurate, if `truncated` is set or rowCount is not known, data will keep loading until `hasNextPage` is `false`
    truncated?: number; // optional: to reflect rowCount is inaccurate (will trigger `x-y of many` in pagination)
  };
}

export interface DataSource {
  /**
    Fetcher Functions:
    - `getRows` is required
    - `updateRow` is optional
    
    `getRows` will be used by the grid to fetch data for the current page or children for the current parent group
    It may return a `rowCount` to update the total count of rows in the grid
  */
  getRows(params: GetRowsParams): Promise<GetRowsResponse>;
  // if passed, will be called like `processRowUpdate` on row edit
  updateRow?(rows: GridRowModel): Promise<any>;

  /**
    Functions related to grouped data (`treeData` and `rowGrouping`):
    - `getGroupKey` is required
    - `hasChildren` is required
    - `getChildrenCount` is optional
    
    `getGroupKey` will be used by the grid to group rows by their parent group
      This effectively replaces `getTreeDataPath`.
      Consider this structure:
      - (1) Sarah // groupKey 'Sarah'
        - (2) Thomas // groupKey 'Thomas'
      When (2) is expanded, the `load` function will be called with group keys ['Sarah', 'Thomas'].
    `hasChildren` will be used by the grid to determine if a row has children on server
    `getChildrenCount` will be used by the grid to determine the number of children of a row on server
  */
  getGroupKey(row: GridRowModel): string; // returns the key of the group to which the row belongs (`treeData` and `rowGrouping`)
  hasChildren(row: GridRowModel): boolean; // return `true` if row has children on server
  getChildrenCount?: (row: GridRowModel) => number; // optional child count
  // these /\ 3 could also be root props of the grid
}
