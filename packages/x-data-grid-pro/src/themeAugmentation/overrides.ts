import { GridClassKey } from '@mui/x-data-grid';

export interface DataGridProComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends DataGridProComponentNameToClassKey {}
}
