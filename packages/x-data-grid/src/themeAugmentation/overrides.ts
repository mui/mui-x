import { DataGridClassKey } from '../constants/dataGridClasses';

export interface DataGridComponentNameToClassKey {
  MuiDataGrid: DataGridClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends DataGridComponentNameToClassKey {}
}
