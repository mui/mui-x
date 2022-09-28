import { GridClassKey } from '@mui/x-data-grid';

export interface DataGridPremiumComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@mui/material/styles/overrides' {
  interface ComponentNameToClassKey extends DataGridPremiumComponentNameToClassKey {}
}
