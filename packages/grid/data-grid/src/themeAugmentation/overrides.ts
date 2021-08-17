import { GridClassKey } from '../../../_modules_/grid/models/gridClasses';

export interface GridComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

// TODO v5 use '@material-ui/core/styles'
declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey extends GridComponentNameToClassKey {}
}
