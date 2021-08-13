import { GridClassKey } from './models/gridClasses';

export interface GridComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey extends GridComponentNameToClassKey {}
}
