import { GridColDef } from '@mui/x-data-grid-pro';

export interface GridColDefGenerator extends GridColDef {
  generateData?: (data: any) => any;
}
