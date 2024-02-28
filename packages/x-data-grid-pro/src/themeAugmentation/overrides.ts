import { DataGridClassKey } from '@mui/x-data-grid';

export interface DataGridProComponentNameToClassKey {
  MuiDataGrid: DataGridClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends DataGridProComponentNameToClassKey {}
}
