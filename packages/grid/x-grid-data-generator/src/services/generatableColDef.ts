import { ColDef } from '@material-ui/x-grid';

export interface GeneratableColDef extends ColDef {
  generateData: (data: any) => any;
}
