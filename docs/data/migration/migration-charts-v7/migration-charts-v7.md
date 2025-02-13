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

## Legend direction value change ✅

The `direction` prop of the legend has been changed to accept `'vertical'` and `'horizontal'` instead of `'column'` and `'row'`.

```diff
 <PieChart
   slotProps={{
     legend: {
-      direction: 'column'
+      direction: 'vertical'
     }
   }}
 />
```

## Legend position value change ✅

Replace `"left" | "middle" | "right"` values with `"start" | "center" | "end"` respectively.
This is to align with the CSS values and reflect the RTL ability of the legend component.

```diff
 <BarChart
    slotProps={{
      legend: {
        position: {
-          horizontal: "left",
+          horizontal: "start",
        }
      }
    }}
 />
```

## Rename `LegendPosition` type to `Position` ✅

Renames `LegendPosition` to `Position`.

```diff
-import { LegendPosition } from '@mui/x-charts/ChartsLegend';
+import { Position } from '@mui/x-charts/models';
```

## The `getSeriesToDisplay` function was removed

The `getSeriesToDisplay` function was removed in favor of the `useLegend` hook. You can check the [HTML Components example](/x/react-charts/components/#html-components) for usage information.

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

## Removing ChartsOnAxisClickHandler ✅

The `ChartsOnAxisClickHandler` component got removed.
The `onAxisClick` handler can directly be passed to the chart containers.

```diff
+ <ChartContainer onAxisClick={() => {}}>
- <ChartContainer>
-   <ChartsOnAxisClickHandler onAxisClick={() => {}} />
 </ChartContainer>
```

:::warning
This codemode does not work if component got renamed or if the handler is not a direct child of the container.
:::

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

## Remove `experimentalMarkRendering` prop ✅

The `experimentalMarkRendering` prop has been removed from the LineChart component.
The line mark are now `<circle />` element by default.
And you can chose another shape by adding a `shape` property to your line series.

The codemod only removes the `experimentalMarkRendering` prop.
If you relied on the fact that marks were `path` elements, you need to update your logic.

## Replacing `useHighlighted` by `useItemHighlighted` and `useItemHighlightedGetter`

The `useHighlighted` hook that gave access to the internal highlight state has been removed.

To know if your item is highlighted, it is recommended to use the `useItemHighlighted` hook instead:

```jsx
const { isFaded, isHighlighted } = useItemHighlighted({
  seriesId,
  dataIndex,
});
```

If you're in a case where you have multiple series id to test (for example in the tooltip), you can use the lower level hook `useItemHighlightedGetter`.
This hook being lower level only test is the item match with the highlight or fade scope.
So an item could at the same time have `isFaded` and `isHighlighted` returning `true`.

```jsx
const { isFaded, isHighlighted } = useItemHighlightedGetter();

const itemIsHighlighted = isHighlighted({ seriesId, dataIndex });

// First make sure the item is not highlighted.
const itemIsFaded = !itemIsHighlighted && isFaded({ seriesId, dataIndex });
```

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

## Stabilize `useSeries` and `useXxxSeries` hooks ✅

The `useSeries` hook family has been stabilized and renamed accordingly.

```diff
  import {
-   unstable_useSeries,
+   useSeries,
-   unstable_usePieSeries,
+   usePieSeries,
-   unstable_useLineSeries,
+   useLineSeries,
-   unstable_useBarSeries,
+   useBarSeries,
-   unstable_useScatterSeries,
+   useScatterSeries,
  } from '@mui/x-charts/hooks';
  import {
-   unstable_useHeatmapSeries,
+   useHeatmapSeries,
  } from '@mui/x-charts-pro/hooks';
```

## Rename `colors` prop in `SparkLineChart`

The `colors` prop in `SparkLineChart` has been renamed to `color`. It now accepts a single color or a function that returns a color.

```diff
  <SparkLineChart
-   colors={['#000', '#fff']}
+   color="#000"
  />
```

We provide a codemod to fix simple cases of this change, which you can run as follows:

```bash
npx @mui/x-codemod@latest v8.0.0/charts/rename-sparkline-colors-to-color <path>
```

For more complex cases, you may need to adjust the code manually. To aid you in finding these cases, the codemod adds a comment prefixed by `mui-x-codemod`, which you can search for in your codebase.
