import { GridClassKey } from '../../../_modules_/grid/gridClasses';

export interface GridComponentNameToClassKey {
  MuiDataGridPro: GridClassKey;
}

// TODO v5 use '@material-ui/core/styles'
declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey extends GridComponentNameToClassKey {}
}
