---
productId: x-charts
---

# Migration from v7 to v8

<p class="description">This guide describes the changes needed to migrate Charts from v7 to v8.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-charts` from v7 to v8.
The change between v7 and v8 is mostly here to match the version with other MUI X packages.
No big breaking changes are expected.

## Start using the new release

In `package.json`, change the version of the charts package to `next`.

```diff
-"@mui/x-charts": "^7.0.0",
+"@mui/x-charts": "next",

-"@mui/x-charts-pro": "^7.0.0",
+"@mui/x-charts-pro": "next",
```

Using `next` ensures that it will always use the latest v8 pre-release version, but you can also use a fixed version, like `8.0.0-alpha.0`.

## Breaking changes

Since v8 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v7 to v8.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v8. You can run `v8.0.0/charts/preset-safe` targeting only Charts or `v8.0.0/preset-safe` to target the other packages as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

<!-- #default-branch-switch -->

```bash
# Charts-specific
npx @mui/x-codemod@latest v8.0.0/charts/preset-safe <path>

# Target the other packages as well
npx @mui/x-codemod@latest v8.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for the Charts](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-charts-v800) for more details.
:::

Breaking changes that are handled by this codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen.

If you have already applied the `v8.0.0/charts/preset-safe` (or `v8.0.0/preset-safe`) codemod, then you should not need to take any further action on these items.

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

## Series properties renaming

Some properties were deprecated in v7 in favor of a more consistent naming convention.
Those deprecated properties have been removed in v8.

The impacted properties are:

- The `xAxisKey`, `yAxisKey`, and `zAxisKey` have been renamed `xAxisId`, `yAxisId`, and `zAxisId`.
- The `highlighted` and `faded` properties of `series.highlightScope` have been renamed `highlight` and `fade`.

## Legend props propagation ✅

The `legend` prop of charts single components has been removed.
To pass props to the legend, use the `slotProps.legend`.

```diff
-<PieChart legend={{ ... }} />
+<PieChart slotProps={{ legend: { ... } }} />
```

## Removing ResponsiveChartContainer ✅

The `ResponsiveChartContainer` has been removed.
You can now use `ChartContainer` as a responsive container which works now exactly the same way.

```diff
-import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
-import { ResponsiveChartContainerPro } from '@mui/x-charts-pro/ResponsiveChartContainerPro';
+import { ChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
+import { ChartContainerPro } from '@mui/x-charts-pro/ResponsiveChartContainerPro';

-<ResponsiveChartContainer>
+<ChartContainer>
   <BarPlot />
-</ResponsiveChartContainer>
+</ChartContainer>
```

## New DOM structure for ChartContainer

The `<ChartContainer />` now wraps the `svg` component into a `div`.

This change should not impact your codebase except for some CSS selector edge cases.

## Remove Pie Chart axes

The `<PieChart />` by error had the code to render axes.
This code has been removed in v8, which implies removing the following props: `axisHighlight`, `topAxis`, `rightAxis`, `bottomAxis`, and `leftAxis`.

This should not impact your code.
If you used axes in a pie chart please open an issue, we would be curious to get more information about the use case.

## Remove `resolveSizeBeforeRender` prop

The `resolveSizeBeforeRender` prop has been removed from all components.
If you were using this prop, you can safely remove it.

## Rename `labelFontSize` and `tickFontSize` props ✅

The `labelFontSize` and `tickFontSize` props have been removed in favor of the style objects `labelStyle` and `tickStyle` respectively.

```diff
  <ChartsXAxis
-   labelFontSize={18}
+   labelStyle={{
+     fontSize: 18
+   }}
-   tickFontSize={20}
+   tickStyle={{
+     fontSize: 20
+   }}
  />
```
