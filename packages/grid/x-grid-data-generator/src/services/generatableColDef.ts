import { GridColDef } from '@material-ui/x-grid';

export interface GeneratableColDef extends GridColDef {
  generateData: (data: any) => any;
}
