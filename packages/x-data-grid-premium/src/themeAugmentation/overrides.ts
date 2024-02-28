import { DataGridClassKey } from '@mui/x-data-grid';

export interface DataGridPremiumComponentNameToClassKey {
  MuiDataGrid: DataGridClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends DataGridPremiumComponentNameToClassKey {}
}
