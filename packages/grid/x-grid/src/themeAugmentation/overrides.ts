import { GridClassKey } from '../../../_modules_/grid/models/gridClasses';

export interface DataGridProComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey extends DataGridProComponentNameToClassKey {}
}
