import { ColDef } from '@material-next/x-grid';

export interface GeneratableColDef extends ColDef {
  generateData: (data: any) => any;
}
