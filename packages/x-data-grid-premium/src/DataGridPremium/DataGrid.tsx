/**
 * @deprecated Import DataGridPremium instead.
 */
export function DataGrid() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  throw new Error(
    [
      "You try to import Data Grid from @mui/x-data-grid-premium but this module isn't exported from this npm package.",
      '',
      "Instead, you can do `import { DataGridPremium } from '@mui/x-data-grid-premium'`.",
      '',
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
      "You try to import Data Grid Pro from @mui/x-data-grid-premium but this module isn't exported from this npm package.",
      '',
      "Instead, you can do `import { DataGridPremium } from '@mui/x-data-grid-premium'`.",
      '',
    ].join('\n'),
  );
}
