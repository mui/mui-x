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

## Change `seriesId` type to `string`

The `seriesId` property accepted `number | string`.
In v9, only `string` is accepted.

This type modification impacts the objects in the `series` props, as well as the `highlightedItem` and `tooltipItem` objects.

## Renaming `id` to `seriesId` ✅

Some components used for composition got their prop `id` renamed `seriesId` to improve clarity.

Here is the list of slots and components that are impacted by the renaming:

| slot          | Component                                |
| :------------ | :--------------------------------------- |
| pieArc        | PieArc                                   |
|               | PieArcPlot                               |
| pieArcLabel   | PieArcLabel                              |
|               | PieArcLabelPlot                          |
| bar           | BarElement, AnimatedRangeBarElementProps |
| area          | AnimatedArea, AreaElement                |
| line          | AnimatedLine, LineElement                |
| mark          | MarkElement                              |
| lineHighlight | LineHighlightElement                     |

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

### ✅ `ChartApi` type moved to `@mui/x-charts/context`

The `ChartApi` type export has been moved from `@mui/x-charts/ChartContainer` to `@mui/x-charts/context`.

```diff
-import type { ChartApi } from '@mui/x-charts/ChartContainer';
+import type { ChartApi } from '@mui/x-charts/context';
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

## Hooks

### `use[Type]Series()` with empty array

When `use[Type]Series()` hooks received an empty array, they returned all the available series of the given type.
In v9 they return an empty array.

```js
// In v8
useBarSeries(['id-1']); // Returns [{ id: "id-1", ... }]
useBarSeries([]); // Returns [{ id: "id-1", ... }, { id: "id-2", ... }, ...]

// In v9
useBarSeries(['id-1']); // Returns [{ id: "id-1", ... }]
useBarSeries([]); // Returns []
```

### Rename `useAxisTooltip` hook

The `useAxisTooltip` hook has been renamed to `useAxesTooltip` to better reflect its functionality of handling multiple axes.

The hook now always returns an array of tooltip data (one entry per active axis) instead of a single object.

```diff
-import { useAxisTooltip, UseAxisTooltipReturnValue, UseAxisTooltipParams } from '@mui/x-charts';
+import { useAxesTooltip, UseAxesTooltipReturnValue, UseAxesTooltipParams } from '@mui/x-charts';
```

Run the following command to do the renaming.

```bash
npx @mui/x-codemod@next v9.0.0/charts/rename-axis-tooltip-hook <path|folder>
```

After running the codemod make sure to adapt the hook returned value to your needs.

```diff
 function CustomTooltip() {
   // If you want to keep only one axis
-  const tooltipData = useAxisTooltip();
+  const tooltipData = useAxesTooltip()[0] ?? null;
   // If you use all the axes
-  const tooltipData = useAxisTooltip({ multipleAxes: true });
+  const tooltipData = useAxesTooltip();
 }
```

## Heatmap

### `hideLegend` default value changed ✅

The default value of the `hideLegend` prop in the `Heatmap` component has changed from `true` to `false` in v9.
This improves consistency across chart components and developer experience.

```diff
 <Heatmap
+  hideLegend
 />
```

### New identifier structure

The heatmap identifier type has been modified as follow.

This new type relies on the `xIndex`/`yIndex` to identify the cell instead of just the `dataIndex`.
Which simplifies the identification of cells without data.

```diff
 {
  type: 'heatmap';
  seriesId: SeriesId;
  dataIndex?: number;
-  xIndex?: number;
+  xIndex: number;
-  yIndex?: number;
+  yIndex: number;
 }
```

## Legend

### `LegendItemParams` Modification

This type is used in the return value of `useLegend()`.
If you haven't created a custom legend, you should not be impacted by this change.

#### Property `type` is now required

The `type` property of `LegendItemParams` has been modified from optional to required.

#### Property `id` is removed

The `id` property of `LegendItemParams` was deprecated in v8 and is removed in v9.
You should use the `seriesId` and `dataIndex` instead.

## Axis

### Styling axes by ID

The `axisClasses.id` class and the dynamically generated `MuiChartsAxis-id-{axisId}` classes have been removed.
To style a specific axis by its ID, use the `data-axis-id` attribute selector instead.

This change improves maintainability by using data attributes rather than dynamic class name suffixes.

```diff
-import { axisClasses } from '@mui/x-charts/ChartsAxis';
-
-// CSS selector
-`.MuiChartsAxis-id-myXAxis`
-// Or using axisClasses
-`.${axisClasses.id}-myXAxis`
+import { axisClasses } from '@mui/x-charts/ChartsAxis';
+
+// CSS selector
+`.MuiChartsAxis-root[data-axis-id="myXAxis"]`
+// Or using axisClasses
+`.${axisClasses.root}[data-axis-id="myXAxis"]`
```

If you're using the `sx` prop or `styled()`:

```diff
 <LineChart
   sx={{
-    [`& .MuiChartsAxis-id-myXAxis`]: {
+    [`& .MuiChartsAxis-root[data-axis-id="myXAxis"]`]: {
       // Your custom styles
     },
   }}
 />
```
