// cspell:ignore codemod
/**
 * Shared config for the changeset-sourced changelog tooling (prototype).
 * Imported by `generate.mjs` (render) and `validate.mjs` (CI pattern checks).
 */

/**
 * Product → tier → package-name map. Order defines section order in the output
 * and mirrors the `logProductSection` calls in `scripts/changelogUtils.mjs`.
 */
export const PRODUCTS = [
  { name: 'Data Grid', tiers: { base: 'x-data-grid', pro: 'x-data-grid-pro', premium: 'x-data-grid-premium' } },
  { name: 'Date and Time Pickers', tiers: { base: 'x-date-pickers', pro: 'x-date-pickers-pro' } },
  { name: 'Charts', tiers: { base: 'x-charts', pro: 'x-charts-pro', premium: 'x-charts-premium' } },
  { name: 'Tree View', tiers: { base: 'x-tree-view', pro: 'x-tree-view-pro' } },
  { name: 'Scheduler', tiers: { base: 'x-scheduler', premium: 'x-scheduler-premium' } },
  { name: 'Codemod', tiers: { base: 'x-codemod' } },
];

export const TIER_META = {
  pro: `[![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')`,
  premium: `[![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')`,
};

export const TIER_RANK = { base: 0, pro: 1, premium: 2 };

/**
 * Default `[tag]` per package when a changeset omits the `tag` frontmatter
 * field. Authors override with `tag:` for component-level precision
 * (e.g. `DateRangeCalendar` instead of `pickers`).
 */
export const DEFAULT_TAG = {
  'x-data-grid': 'DataGrid',
  'x-data-grid-pro': 'DataGridPro',
  'x-data-grid-premium': 'DataGridPremium',
  'x-date-pickers': 'pickers',
  'x-date-pickers-pro': 'pickers',
  'x-charts': 'charts',
  'x-charts-pro': 'charts-pro',
  'x-charts-premium': 'charts-premium',
  'x-tree-view': 'TreeView',
  'x-tree-view-pro': 'RichTreeViewPro',
  'x-scheduler': 'scheduler',
  'x-scheduler-premium': 'scheduler',
  'x-codemod': 'codemod',
};

/** Reverse lookup: `@mui/x-data-grid-pro` → { product, tier, pkg }. */
export function buildPackageIndex() {
  const index = new Map();
  for (const product of PRODUCTS) {
    for (const [tier, pkg] of Object.entries(product.tiers)) {
      index.set(`@mui/${pkg}`, { product, tier, pkg });
    }
  }
  return index;
}
