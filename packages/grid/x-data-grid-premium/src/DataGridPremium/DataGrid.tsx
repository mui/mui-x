export { SUBMIT_FILTER_STROKE_TIME, SUBMIT_FILTER_DATE_STROKE_TIME } from '@mui/x-data-grid';

/**
 * @deprecated Import DataGridPremium instead.
 */
export function DataGrid() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  throw new Error(
    [
      "You try to import `DataGrid` from @mui/x-data-grid-premium but this module doesn't exist.",
      '',
      "Instead, you can do `import { DataGridPremium } from '@mui/x-data-grid-premium'`.",
    ].join('\n'),
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
    [
      "You try to import `DataGridPro` from @mui/x-data-grid-premium but this module doesn't exist.",
      '',
      "Instead, you can do `import { DataGridPremium } from '@mui/x-data-grid-premium'`.",
    ].join('\n'),
  );
}
