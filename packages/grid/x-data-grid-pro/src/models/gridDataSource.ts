import { GridFilterModel, GridSortModel } from '@mui/x-data-grid';

export interface GetRowsParams {
  groupKeys: string[];
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
}

export interface GridDataSource {
  getRows: (params: GetRowsParams) => Promise<any>;
}
