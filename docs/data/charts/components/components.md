---
title: Charts - Custom components
productId: x-charts
components: ChartsClipPath, ChartsSurface
---

# Charts - Custom components

<p class="description">Create custom chart components using the provided hooks.</p>

The MUI X Charts package provides a set of hooks to aid in the creation of custom Chart components.

## Interact with dimensions

The following sections detail how to handle the various dimensions when building custom Charts, including height, width, margins, scale, and series data.

### Drawing area

Drawing area refers to the space available to plot data (such as scatter points, lines, or pie arcs).
Charts dimensions are defined by the following props:

- `height` and `width` for the SVG size; if not provided, these values are derived from the container
- `margin` for the space between the SVG border and the axes or the drawing area
- The axes dimension properties (`xAxis[].height` and `yAxis[].width`) that add extra space to draw axes

The `margin` is used to leave space for extra elements, or to let data items overflow the drawing area.

You can use the `useDrawingArea()` hook in the Chart subcomponents to get the coordinates of the drawing area:

```jsx
import { useDrawingArea } from '@mui/x-charts';

const { left, top, width, height } = useDrawingArea();
```

{{"demo": "BasicScaleDemo.js"}}

### Scales

Some Charts, such as Line, Bar, and Scatter, do a mapping between their series' data and the SVG coordinates.

For example, a line chart series with a value of $36,725 on the 6th of December 2022 could be mapped to coordinates (628, 514).
This operation can also be reversed:
The coordinate `x=628` would be associated with the 6th of December 2022 and `y=514` would be associated with the value $36,725.

These mappings depend on the dimensions of the SVG and the drawing area.
They also depend on [axis properties](/x/react-charts/axis/) such as the scale (linear, log, square root) and min/max values.
All of this data is available in the [`d3-scale` objects](https://github.com/d3/d3-scale).

You can use `useXScale()` and `useYScale()` to access these scales.
Both accept a number or a string.
Use a number to select the index of the axis to be used, or a string to select an axis by its ID.

The scale object is generated so that it maps values to SVG coordinates.
The drawing area is automatically accounted for.

#### Value to coordinate

The default `d3-scale` method maps from values to coordinates.
For example, you can get the `x=0` coordinate as follows:

```jsx
// get the default x-axis scale
const xAxisScale = useXScale();
// get the position associated to the value 0
const xOrigin = xAxisScale(0);
```

{{"demo": "OriginDemo.js"}}

#### Coordinate to value

The `d3-scale` object lets you convert a coordinate to a data value with the `invert()` method.

The next example contains two lines drawn using different y-axes.
By using `invert()`, the value associated with the current mouse coordinate `y` can be resolved as follows:

```jsx
<text>{leftAxisScale.invert(yCoordinate).toFixed(0)}</text>
```

{{"demo": "ScaleDemo.js"}}

### Series

Series information is accessible through the `useSeries()` hook for all series types, and the `use[Type]Series()` hook for a specific series type.
These hooks return the order of the series and their configuration, including data points, color, and more.

You can use that information to create custom charts.
For example, you can use `useLineSeries()` to obtain the series of a Line Chart and display an indicator of the minimum and maximum values of each series:

{{"demo": "SeriesDemo.js"}}

## Custom slot props with TypeScript

If the custom component requires additional props to work properly, TypeScript may throw type errors.
To solve these type errors, use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to enhance the props interface.

The naming of overridable interfaces uses a pattern like this:

```js
`${slotNameInPascalCase}PropsOverrides`;
```

For example, for the `tooltip` slot, the interface name is `TooltipPropsOverrides`.

These files list every overridable interface for the Charts packages:

- [`@mui/x-charts`](https://github.com/mui/mui-x/blob/-/packages/x-charts/src/models/chartsSlotsComponentsProps.ts)
- [`@mui/x-charts-pro`](https://github.com/mui/mui-x/blob/-/packages/x-charts-pro/src/models/chartsSlotsComponentsPropsPro.ts) (pro-only slots: heatmap `cell`, funnel sections, pro toolbar icons, pro base slots)
- [`@mui/x-charts-premium`](https://github.com/mui/mui-x/blob/-/packages/x-charts-premium/src/models/chartsSlotsComponentsPropsPremium.ts) (premium-only slots: `radialLineHighlight`)

<codeblock storageKey="pricing-plan">

```tsx Community
// augment the props for the tooltip slot
declare module '@mui/x-charts' {
  interface TooltipPropsOverrides {
    someCustomString: string;
    someCustomNumber: number;
  }
}

<LineChart
  series={[{ data: [1, 2, 3] }]}
  slots={{
    // custom component passed to the tooltip slot
    tooltip: CustomTooltip,
  }}
  slotProps={{
    tooltip: {
      // props used by CustomTooltip
      someCustomString: 'Hello',
      someCustomNumber: 42,
    },
  }}
/>;
```

```tsx Pro
// augment the props for a pro-only slot (heatmap cell)
declare module '@mui/x-charts-pro' {
  interface CellPropsOverrides {
    someCustomString: string;
    someCustomNumber: number;
  }
}

<Heatmap
  xAxis={[{ data: [1, 2, 3] }]}
  yAxis={[{ data: [1, 2, 3] }]}
  series={[{ data: [[0, 0, 1]] }]}
  slots={{
    // custom component passed to the cell slot
    cell: CustomHeatmapCell,
  }}
  slotProps={{
    cell: {
      // props used by CustomHeatmapCell
      someCustomString: 'Hello',
      someCustomNumber: 42,
    },
  }}
/>;
```

```tsx Premium
// augment the props for a premium-only slot (radial line highlight)
declare module '@mui/x-charts-premium' {
  interface RadialLineHighlightPropsOverrides {
    someCustomString: string;
    someCustomNumber: number;
  }
}

<RadialLineChart
  series={[{ data: [1, 2, 3] }]}
  radiusAxis={[{ data: [1, 2, 3] }]}
  rotationAxis={[{ data: [0, 120, 240] }]}
  slots={{
    // custom component passed to the radialLineHighlight slot
    radialLineHighlight: CustomRadialLineHighlight,
  }}
  slotProps={{
    radialLineHighlight: {
      // props used by CustomRadialLineHighlight
      someCustomString: 'Hello',
      someCustomNumber: 42,
    },
  }}
/>;
```

</codeblock>

:::info
Augmentations always target the module where the interface is **originally declared**.
The Pro and Premium tabs above augment `@mui/x-charts-pro` and `@mui/x-charts-premium` because the example slots (`cell`, `radialLineHighlight`) are declared in those packages.
Slots shared across tiers (such as `tooltip`, `legend`, `toolbar`) are declared in `@mui/x-charts` — augment them via `declare module '@mui/x-charts'` regardless of which chart you use.
:::

## HTML components

Use the `ChartsDataProvider` to access chart data from any component.
This lets you create HTML components that interact with the data.

In the next example, notice that the `MyCustomLegend` component displays the series names and colors.
This creates an HTML `<table>` element, which can be customized in any way.

{{"demo": "HtmlLegend.js"}}

:::warning
Note that the HTML components are not part of the SVG hierarchy.
This means they must be outside of the `ChartsSurface` component to avoid mixing HTML and SVG, and inside of the `ChartsDataProvider` component to get access to the data.
:::
