/**
 * @deprecated Import DataGridPro instead.
 */
export function DataGrid() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  throw new Error(
    'MUI X Data Grid: DataGrid is not exported from @mui/x-data-grid-pro. ' +
      'The Pro package exports DataGridPro instead. ' +
      "Use `import { DataGridPro } from '@mui/x-data-grid-pro'` or import DataGrid from @mui/x-data-grid.",
  );
}

/**
 * @deprecated Import DataGridPro instead.
 */
export function DataGridPremium() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  throw new Error(
    'MUI X Data Grid: DataGridPremium is not exported from @mui/x-data-grid-pro. ' +
      'For Premium features, use @mui/x-data-grid-premium with a Premium plan license. ' +
      "Otherwise, use `import { DataGridPro } from '@mui/x-data-grid-pro'` for Pro features.",
  );
}
