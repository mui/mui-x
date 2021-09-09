import { GridClassKey } from '../../../_modules_/grid/gridClasses';

export interface DataGridProComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@mui/material/styles/overrides' {
  interface ComponentNameToClassKey extends DataGridProComponentNameToClassKey {}
}
