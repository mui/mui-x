/**
 * @deprecated Import DataGridPremium instead.
 */
export function DataGrid() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  throw new Error(
    'MUI X Data Grid: DataGrid is not exported from @mui/x-data-grid-premium. ' +
      'The Premium package exports DataGridPremium instead. ' +
      "Use `import { DataGridPremium } from '@mui/x-data-grid-premium'` or import DataGrid from @mui/x-data-grid.",
  );
}

/**
 * @deprecated Import DataGridPremium instead.
 */
export function DataGridPro() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  throw new Error(
    'MUI X Data Grid: DataGridPro is not exported from @mui/x-data-grid-premium. ' +
      'The Premium package exports DataGridPremium instead. ' +
      "Use `import { DataGridPremium } from '@mui/x-data-grid-premium'`.",
  );
}
