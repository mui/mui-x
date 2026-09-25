import type { GridClassKey } from '@mui/x-data-grid';

export interface DataGridProComponentNameToClassKey {
  MuiDataGrid: GridClassKey;
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends DataGridProComponentNameToClassKey {}

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
