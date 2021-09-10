import { GridClassKey } from '../../../_modules_/grid/gridClasses';

export interface DataGridComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@mui/material/styles/overrides' {
  interface ComponentNameToClassKey extends DataGridComponentNameToClassKey {}
}
