export { SUBMIT_FILTER_STROKE_TIME, SUBMIT_FILTER_DATE_STROKE_TIME } from '@mui/x-data-grid';

/**
 * @deprecated Import DataGridPro instead.
 */
export function DataGrid() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  throw new Error(
    [
      "You try to import `DataGrid` from @mui/x-data-grid-pro but this module doesn't exist.",
      '',
      "Instead, you can do `import { DataGridPro } from '@mui/x-data-grid-pro'`.",
    ].join('\n'),
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
    [
      "You try to import `DataGridPremium` from @mui/x-data-grid-pro but this module doesn't exist.",
      '',
      "Instead, you can do `import { DataGridPro } from '@mui/x-data-grid-pro'`.",
    ].join('\n'),
  );
}
