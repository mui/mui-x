/**
 * @deprecated Import DataGridPro instead.
 */
export function DataGrid() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  throw new Error(
    [
      "You try to import `DataGrid` from @mui/x-data-grid-pro but this module isn't exported from this npm package.",
      '',
      "Instead, you can do `import { DataGridPro } from '@mui/x-data-grid-pro'`.",
      '',
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
      "You try to import `DataGridPremium` from @mui/x-data-grid-pro but this module isn't exported from this npm package.",
      '',
      'Instead, if you have a Premium plan license or want to try Premium, you can do this:',
      `import { DataGridPremium } from '@mui/x-data-grid-premium'`,
      '',
      "Otherwise, you can stay on the Pro plan: `import { DataGridPro } from '@mui/x-data-grid-pro'`.",
      '',
    ].join('\n'),
  );
}
