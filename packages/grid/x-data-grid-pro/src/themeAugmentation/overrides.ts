import { GridClassKey } from '@mui/x-data-grid/internals';

export interface DataGridProComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@mui/material/styles/overrides' {
  interface ComponentNameToClassKey extends DataGridProComponentNameToClassKey {}
}
