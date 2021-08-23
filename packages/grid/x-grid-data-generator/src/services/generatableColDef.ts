import { GridColDef } from '@mui/x-data-grid-pro';

export interface GeneratableColDef extends GridColDef {
  generateData: (data: any) => any;
}
