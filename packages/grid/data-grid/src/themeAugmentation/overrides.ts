import { GridClassKey } from '../../../_modules_/grid/gridClasses';

export interface DataGridComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey extends DataGridComponentNameToClassKey {}
}
