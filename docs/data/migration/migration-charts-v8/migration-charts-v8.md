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

## Prepare for the migration

We highly recommend updating `@mui/x-charts`, `@mui/x-charts-pro`, and `@mui/x-charts-premium` to the latest v8 version before migrating to v9.
This will help you resolve deprecation warnings at your own pace, reducing the number of changes needed when upgrading.

Below is a list of deprecated APIs that have alternatives in the latest minor of v8. We recommend you move from these deprecated APIs before upgrading to v9 to ease the migration.
Items marked with ✅ are handled by the [codemod](#run-codemods).

### Component and type renames (Chart → Charts) ✅

The `Chart` prefix has been renamed to `Charts` (with an S) to align with other components.

| Deprecated                             | Replacement                             |
| :------------------------------------- | :-------------------------------------- |
| `ChartContainer`                       | `ChartsContainer`                       |
| `ChartContainerProps`                  | `ChartsContainerProps`                  |
| `ChartContainerSlots`                  | `ChartsContainerSlots`                  |
| `ChartContainerSlotProps`              | `ChartsContainerSlotProps`              |
| `useChartContainerProps()`             | `useChartsContainerProps()`             |
| `UseChartContainerPropsReturnValue`    | `UseChartsContainerPropsReturnValue`    |
| `ChartContainerPro`                    | `ChartsContainerPro`                    |
| `ChartContainerProProps`               | `ChartsContainerProProps`               |
| `ChartContainerProSlots`               | `ChartsContainerProSlots`               |
| `ChartContainerProSlotProps`           | `ChartsContainerProSlotProps`           |
| `useChartContainerProProps()`          | `useChartsContainerProProps()`          |
| `UseChartContainerProPropsReturnValue` | `UseChartsContainerProPropsReturnValue` |
| `ChartZoomSlider`                      | `ChartsZoomSlider`                      |
| `ChartAxisZoomSliderThumbClasses`      | `ChartsAxisZoomSliderThumbClasses`      |
| `ChartAxisZoomSliderThumbClassKey`     | `ChartsAxisZoomSliderThumbClassKey`     |
| `chartAxisZoomSliderThumbClasses`      | `chartsAxisZoomSliderThumbClasses`      |
| `ChartAxisZoomSliderTrackClasses`      | `ChartsAxisZoomSliderTrackClasses`      |
| `ChartAxisZoomSliderTrackClassKey`     | `ChartsAxisZoomSliderTrackClassKey`     |
| `chartAxisZoomSliderTrackClasses`      | `chartsAxisZoomSliderTrackClasses`      |

### CSS class deprecations (`highlighted` / `faded`)

The highlighted and faded CSS state classes are deprecated across all chart element types.
Use `[data-highlighted]` and `[data-faded]` attribute selectors instead.

This affects: `BarElement`, `BarLabel`, `LineElement`, `AreaElement`, `MarkElement`, `PieArc`, `PieArcLabel`, `RadarSeriesPlot`, `Heatmap`, and `FunnelSection`.

```diff
-`.MuiBarElement-root.MuiBarElement-highlighted`
+`.MuiBarElement-root[data-highlighted]`

-`.MuiBarElement-root.MuiBarElement-faded`
+`.MuiBarElement-root[data-faded]`
```

### Unstable exports are now stable

- `Unstable_RadarChart` → `RadarChart`
- `Unstable_RadarDataProvider` → `RadarDataProvider`
- `Unstable_FunnelChart` → `FunnelChart`
- `Unstable_SankeyChart` → `SankeyChart`

### Props

- The `barLabel` prop on `BarPlot` and `BarChartPro` is deprecated. Use `barLabel` in the series definition instead.
- The `message` prop on `ChartsOverlay` is deprecated. Use the [localization](/x/react-charts/localization/) keys `loading` and `noData` instead.
- The `disableHover` prop on scatter series is deprecated. Disable the highlight or the tooltip separately instead.
- The `onAxisClick` prop on `Heatmap` is deprecated. Use `onItemClick` instead.
- The `components` and `componentsProps` props on `ChartsTooltip`, `HeatmapTooltip`, and `SankeyTooltip` are deprecated. Use `slots` and `slotProps` instead.

### Other

- The `useMouseTracker()` hook is deprecated. Use vanilla JavaScript to track the mouse position instead.
- The `itemId` property in `SeriesLegendItemContext` is deprecated. Use `dataIndex` instead.
- The `innerRadius` and `outerRadius` params in `useAnimatePieArcLabel` are deprecated. Use `arcLabelRadius` instead.

## Start using the new release

In `package.json`, change the version of the charts package to `next`.

```diff
-"@mui/x-charts": "^8.x.x",
+"@mui/x-charts": "next",

-"@mui/x-charts-pro": "^8.x.x",
+"@mui/x-charts-pro": "next",

-"@mui/x-charts-premium": "^8.x.x",
+"@mui/x-charts-premium": "next",
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

### Series' id should be unique

In v8 series `id` properties was enforced to be unique per series type.
In v9 series `id` properties must be unique among all series, regardless of their type.

The following code was valid in v8, but in v9 one of the IDs need to be modified.

```jsx
series={[
  { type: 'line', id: 'series-a' },
  { type: 'bar', id: 'series-a' },
]}
```

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

### `useItemHighlighted()` replaced by `useItemHighlightState()`

The `useItemHighlighted()` hook is replaced by `useItemHighlightState()`.
Instead of returning an object with `isHighlighted` and `isFaded` booleans.
It now returns a `HighlightState` union type: `'highlighted' | 'faded' | 'none'`.

```diff
-const { isHighlighted, isFaded } = useItemHighlighted(identifier);
+const highlightState = useItemHighlightState(identifier);
+const isHighlighted = highlightState === 'highlighted';
+const isFaded = highlightState === 'faded';
```

### `useItemHighlightedGetter()` replaced by `useItemHighlightStateGetter()`

The `useItemHighlightedGetter()` hook is replaced by `useItemHighlightStateGetter()`.
instead of returning an object with two callbacks `isHighlighted()` and `isFaded()`.
It now returns a single callback `(item) => HighlightState`.
The `HighlightState` type is the union of the following variants: `'highlighted' | 'faded' | 'none'`

```diff
-const { isHighlighted, isFaded } = useItemHighlightedGetter();
-const isItemHighlighted = isHighlighted(item);
-const isItemFaded = !isItemHighlighted && isFaded(item);
+const getHighlightState = useItemHighlightStateGetter();

+const isItemHighlighted = (item) => getHighlightState(item) === 'highlighted'
+const isItemFaded = (item) => getHighlightState(item) === 'faded'
```

### Rename `useAxisTooltip()` hook

The `useAxisTooltip()` hook has been renamed to `useAxesTooltip()` to better reflect its functionality of handling multiple axes.

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

### `useInteractionItemProps` signature changed

The `skip` parameter has been removed from `useInteractionItemProps`.
If you were using it, you can remove it — the hook now always returns interaction props.

```diff
-const interactionProps = useInteractionItemProps(identifier, skip);
+const interactionProps = useInteractionItemProps(identifier);
```

### `useRegisterPointerInteractions` signature changed

The `useRegisterPointerInteractions` hook no longer accepts a `getItemAtPosition` function or `onItemEnter`/`onItemLeave` callbacks.
It now takes no arguments and automatically iterates through all series configs that provide a `getItemAtPosition` function.

This hook is called internally by `ChartsLayerContainer` and should not need to be called manually.
If you were calling it in custom chart components, you can remove the call.

```diff
-useRegisterPointerInteractions(selectorBarItemAtPosition, onItemEnter, onItemLeave);
+// No longer needed — handled by ChartsLayerContainer
```

## Line Chart

### `showMark` default value changed ✅

The default value of the `showMark` prop in the line series has changed from `true` to `false` in v9.

If you were relying on marks being visible by default, explicitly set `showMark` to `true`:

```diff
 <LineChart
   series={[
     {
       data: [1, 2, 3],
+      showMark: true,
     },
   ]}
 />
```

### Default `shape` changed

In v8, the `shape` was set to `'circle'` by default.
Now it alternates across series according to the following order:
`'circle'`, `'square'`, `'diamond'`, `'cross'`, `'star'`, `'triangle'`, `'wye'`.

This modification improves accessibility for color blind people.

If you want to keep the previous behavior, set the `shape` property to `'circle'` on all series.

### Rename `[data-series-id]` by `[data-series]`

The data attribute used to select a given series by it's id got renamed.
Replace the `[data-series-id="<SeriesId>"]` by `[data-series="<SeriesId>"]`.

### Removed item-level pointer handlers

Line chart elements (`MarkElement`, `CircleMarkElement`, `LineElement`, `AreaElement`) no longer attach `onPointerEnter`/`onPointerLeave` event handlers for highlight and tooltip interactions.
These interactions are now handled at the container level using position-based hit detection.

If you were relying on these pointer events being attached to individual SVG elements (for example, via custom slots or DOM inspection), note that they are no longer present.
The highlight and tooltip behavior remains the same from the user's perspective.

## Bar Chart

### Removed item-level pointer handlers

`BarElement` no longer attaches `onPointerEnter`/`onPointerLeave` event handlers.
Highlight and tooltip interactions are now handled at the container level using position-based hit detection.

If you were relying on these pointer events on individual bar elements, note that they are no longer present.
The highlight and tooltip behavior remains the same from the user's perspective.

### `onItemClick` event type changed

The `onItemClick` callback on `BarPlot` and `BarChart` now receives a native `MouseEvent` instead of a `React.MouseEvent`.

```diff
 <BarChart
   onItemClick={(
-    event: React.MouseEvent<SVGElement, MouseEvent>,
+    event: MouseEvent,
     barItemIdentifier: BarItemIdentifier,
   ) => {
     // ...
   }}
 />
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

### Removed compatibility layer for pointer events

The compatibility layer that allowed heatmap custom cell slots to use item-level React pointer event handlers (`onPointerEnter`/`onPointerLeave`) has been removed.
Pointer interactions are now always handled at the container level using position-based hit detection.

If you were using a custom `cell` slot with `onPointerEnter` in `slotProps`, these handlers will no longer be called for highlight/tooltip purposes.
Instead, the chart container detects the hovered cell based on pointer coordinates.

### Theme style overrides use `cell` slot

The `MuiHeatmap` theme style overrides now correctly use the `cell` key instead of `arc`.
Previously, the `overridesResolver` was incorrectly referencing `styles.arc` due to a copy-paste error.
If you were using `arc` as a workaround, update it to `cell`.

```diff
 const theme = createTheme({
   components: {
     MuiHeatmap: {
       styleOverrides: {
-        arc: {
+        cell: {
           fill: 'red',
         },
       },
     },
   },
 });
```

## Sankey

### Removed group

The DOM structure got simplified by removing the group wrapping each nodes.
It's `data-node` attribute got moved to the `rect` associated to it.

```diff
-<g data-node="nodeId-A">
   <rect
+    data-node="nodeId-A"
     x="20"
     /* ... */
   />
-</g>
```

### New identifier structure

The heatmap identifier type has been modified as follows.

This new type relies on the `xIndex`/`yIndex` to identify the cell instead of just the `dataIndex`, permitting the identification of cells without data.

```diff
 {
  type: 'heatmap';
  seriesId: SeriesId;
-  dataIndex?: number;
-  xIndex?: number;
+  xIndex: number;
-  yIndex?: number;
+  yIndex: number;
 }
```

The return type of the `useItemTooltip()` for heatmap series was modified.
Instead of returning an object where the `value` was a `[x, y, cellValue]` tuple, it now returns cell value directly.

If the cell is empty, it returns `null`.

Here is an example about how to get exactly the same info from `useItemTooltip()`.

```diff
 const { identifier, value } = useItemTooltip<'heatmap'>();

 return {
-  xIndex: value[0],
+  xIndex: identifier.xIndex,
-  yIndex: value[1],
+  yIndex: identifier.yIndex,
-  cellValue: value[2],
+  cellValue: value,
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

### The `domainLimit` function signature updated

The `domainLimit` function now receives `NumberValue` instead of `number` for its parameters and return type.
This change allows the function to work correctly with time-based axes where values are `Date` objects.

`NumberValue` is a number-like type that can be either a `number` or an object with a `valueOf(): number` method.
Some objects, such as `Date` already implement this method.
It is now exported from `@mui/x-charts` for convenience.

If you're using TypeScript and have a custom `domainLimit` function, update the types to use the new values.
To get the numeric value, call `valueOf()` on the `NumberValue` parameters.

```diff
+import { NumberValue } from '@mui/x-charts';
+
 calculateDomainLimit(min: number, max: number) {
   // Your implementation
 }

 <LineChart
   xAxis={[{
     scaleType: 'time',
-    domainLimit: (min: number, max: number) => ({ min, max }),
+    domainLimit: (min: NumberValue, max: NumberValue) => calculateDomainLimit(min.valueOf(), max.valueOf()),
   }]}
 />
```

## Styling

### Label mark

The charts label mark has been redesigned to improve consistency in how different mark types can be styled.

The `markElementClasses.mask` class got removed, together with the corresponding `mask` component which was used to create a mask effect on the label mark.

Now the `line` type of mark can be styled in the same way you would a line chart's line element, since they both use SVG `<path>` elements.

```diff
  <LineChart
    sx={{
      [`.${lineElementClasses.root}[data-series="my-series"], .${legendClasses.item}[data-series="my-series"] .${labelMarkClasses.fill}`]:
        {
          strokeDasharray: '3 2',
        },
    }}
  />
```

### Chart class names updated

The following CSS class prefixes have been renamed to include the "Chart" suffix for consistency:

| Old class prefix | New class prefix   |
| :--------------- | :----------------- |
| `MuiScatter-`    | `MuiScatterChart-` |
| `MuiBar-`        | `MuiBarChart-`     |

The `barClasses` and `scatterClasses` objects have been updated, so you can continue to use them without any changes.

If you're using these classes manually in your styles, update them accordingly:

```diff
-`.MuiScatter-root`
+`.MuiScatterChart-root`

-`.MuiBar-root`
+`.MuiBarChart-root`
```

## ChartsSurface

### `data-has-focused-item` attribute removed

The `data-has-focused-item` data attribute has been removed from the root `<svg>` element rendered by `ChartsSurface`.
If you were relying on this attribute to check whether a chart item is focused, use the `useFocusedItem()` hook instead.

```ts
const focusedItem = useFocusedItem();
const hasFocusedItem = focusedItem !== null;
```

### Theme style override removal

The `ChartsSurface` component is now comprised of `ChartsLayerContainer` and `ChartsSvgLayer`.
As a consequence, it is no longer possible to style the component using the `MuiChartsSurface` theme key.
If you want to style the layer container, you can use `MuiChartsLayerContainer` instead, and for the SVG layer, use `MuiChartsSvgLayer`.

### Rename `useSvgRef()` by `useChartsLayerContainerRef()`

The `useSvgRef()` is replaced by `useChartsLayerContainerRef()` which returns a ref to the `ChartsLayerContainer`.

### Ref target

The `ChartsSurface` `ref` is now propagated to the `<div />` rendered by `ChartsLayerContainer` instead of an `<svg />`.

## Keyboard navigation ✅

The keyboard navigation is no enabled by default.
If you used `enableKeyboardNavigation` prop, you can remove it.

To disable this feature, use the prop `disableKeyboardNavigation`.

## Stabilized `experimentalFeatures` ✅

The `preferStrictDomainInLineCharts` experimental feature is now the default behavior.
The x-axis domain limit for line charts defaults to `'strict'`, meaning the axis range matches the data range exactly without extra padding.

If you were using the `experimentalFeatures` prop with `preferStrictDomainInLineCharts`, you can remove it.

```diff
 <LineChart
-  experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
   series={[{ data: [1, 2, 3] }]}
 />
```

If you want to revert to the previous behavior (rounded/"nice" domain limits on the x-axis), set `domainLimit` to `'nice'` on the x-axis configuration:

```jsx
<LineChart xAxis={[{ domainLimit: 'nice' }]} series={[{ data: [1, 2, 3] }]} />
```

## Props propagation

The `ref` for single component charts like `<LineChart />` is now propagated to the root element instead of the SVG element.

Internally this change looks like this.

```diff
 const LineChart = React.forwardRef(function LineChart(
   inProps: LineChartProps,
-  ref: React.Ref<SVGSVGElement>,
+  ref: React.Ref<HTMLDivElement>,
 ) {
   /* ... */
   return (
     <ChartDataProvider>
-      <ChartsWrapper>
+      <ChartsWrapper ref={ref}>
         {/* ... */}
-        <ChartsSurface ref={ref}>
+        <ChartsSurface>
           {/* ... */}
         </ChartsSurface>
     </ChartDataProvider>
   );
 });
```

## Typescript

### Identifiers are now generics

In v9 we introduce generics to our identifiers.

This will allow you to get the correct type according to the series you're using.

#### Remove default generic of `SeriesItemIdentifier`

The argument of `SeriesItemIdentifier` is now required.

It accepts an union of series types.
For example:

- `SeriesItemIdentifier<'bar'>` for a BarChart.
- `SeriesItemIdentifier<'bar' | 'line'>` if you compose bar and line series.

#### Add generic to `HighlightScope`

The `HighlightScope` is now a generic and require its argument the same way `SeriesItemIdentifier` does.

#### Replace `HighlightItemData` by `HighlightItemIdentifier<SeriesType>`

The `HighlightItemData` type was replaced by `HighlightItemIdentifier<SeriesType>`.

The main difference from the `SeriesItemIdentifier` is the ability to identify a whole series.

For example, in a `SeriesItemIdentifier<'bar'>` the `dataIndex` is required since it identifies an item of the series.
A `HighlightItemIdentifier<'bar'>` can identify a data point, which requires a `dataIndex`, but also an entire series, in which case the `dataIndex` is optional.
