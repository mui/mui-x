import { type GridColDef } from '@mui/x-data-grid-pro';

export interface GridPivotModel {
  columns: { field: GridColDef['field']; sort?: 'asc' | 'desc'; hidden?: boolean }[];
  rows: {
    field: GridColDef['field'];
    hidden?: boolean;
  }[];
  values: {
    field: GridColDef['field'];
    aggFunc: string;
    hidden?: boolean;
  }[];
}
