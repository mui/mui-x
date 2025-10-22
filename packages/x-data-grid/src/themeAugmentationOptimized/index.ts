declare module '@mui/material/stylesOptimized' {
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
