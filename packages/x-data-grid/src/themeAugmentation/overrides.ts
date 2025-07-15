import { GridClassKey } from '../constants/gridClasses';

export interface DataGridComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends DataGridComponentNameToClassKey {}

  interface PaletteDataGrid {
    bg?: string;
    headerBg?: string;
    pinnedBg?: string;
  }

  interface CssVarsPalette {
    DataGrid: PaletteDataGrid;
  }

  interface PaletteOptions {
    DataGrid?: Partial<PaletteDataGrid>;
  }
}
