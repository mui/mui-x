---
title: Charts - Migration from v8 to v9
productId: x-charts
---

# Migration from v8 to v9

<p class="description">This guide describes the changes needed to migrate Charts from v8 to v9.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-charts` from v8 to v9.

<!-- Overall theme of this major, fixing API inconsistencies, improving customization, etc -->

:::success
This guide is also available in <a href="https://raw.githubusercontent.com/mui/mui-x/refs/heads/master/docs/data/migration/migration-charts-v8/migration-charts-v8.md" target="_blank">Markdown format</a> to be referenced by AI tools like Copilot or Cursor to help you with the migration.
:::

## Start using the new release

In `package.json`, change the version of the charts package to `latest`.

```diff
-"@mui/x-charts": "^8.x.x",
+"@mui/x-charts": "latest",

-"@mui/x-charts-pro": "^8.x.x",
+"@mui/x-charts-pro": "latest",
```

Since `v9` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from `v8` to `v9`.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v9. You can run `v9.0.0/charts/preset-safe` targeting only Charts or `v9.0.0/preset-safe` to target the other packages as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

<!-- #npm-tag-reference -->

```bash
# Charts-specific
npx @mui/x-codemod@next v9.0.0/charts/preset-safe <path>

# Target the other packages as well
npx @mui/x-codemod@next v9.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for the Charts](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-charts-v900) for more details.
:::

Breaking changes that are handled by this codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen.

If you have already applied the `v9.0.0/charts/preset-safe` (or `v9.0.0/preset-safe`) codemod, then you should not need to take any further action on these items.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading or cross-file dependencies, the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<PieChart {...chartProps} /> // The codemod will not modify the content of `chartProps`.
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
:::

## Heatmap

### `hideLegend` default value changed ✅

The default value of the `hideLegend` prop in the `Heatmap` component has changed from `true` to `false` in v9.
This improves consistency across chart components and developer experience.

```diff
 <Heatmap
+  hideLegend
 />
```

## Removed deprecated types and APIs

The following deprecated types, interfaces, and APIs that were marked as deprecated in v8 have been removed in v9.

### Series types

The following type aliases have been removed from `@mui/x-charts/models`:

- `CartesianSeriesType` - Use `AllSeriesType<CartesianChartSeriesType>` directly if needed
- `DefaultizedCartesianSeriesType` - Use `DefaultizedSeriesType<CartesianChartSeriesType>` directly if needed
- `StackableSeriesType` - Use `DefaultizedSeriesType<StackableChartSeriesType>` directly if needed

```diff
-import { CartesianSeriesType } from '@mui/x-charts/models';
+import { AllSeriesType } from '@mui/x-charts/models';
+import type { CartesianChartSeriesType } from '@mui/x-charts/internals';
+
+type CartesianSeriesType = AllSeriesType<CartesianChartSeriesType>;
```

### Series helper functions

The following helper functions have been removed:

- `isDefaultizedBarSeries()` - Check `series.type === 'bar'` directly
- `isBarSeries()` - Check `series.type === 'bar'` directly

```diff
-import { isBarSeries } from '@mui/x-charts/models';
-
-if (isBarSeries(series)) {
+if (series.type === 'bar') {
   // Handle bar series
 }
```
