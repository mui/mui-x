---
title: React Heatmap chart
productId: x-charts
components: Heatmap, HeatmapPlot, HeatmapTooltip, HeatmapTooltipContent, FocusedHeatmapCell, HeatmapPremium
---

# Charts - Heatmap [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Show data as a grid of colored cells to reveal patterns across two dimensions.</p>

## Overview

A heatmap shows intensity across two dimensions (categorical or continuous) as a grid of colored cells.
It highlights areas of high and low concentration, so you can spot trends, clusters, or anomalies.
Each cell is the intersection of two variables, with color representing the value.
{{"demo": "HeatmapDemo.js", "disableAd": true, "defaultCodeOpen": false}}

## Basics

A heatmap series must include a `data` property with an array of 3-tuples.
Each tuple is `[xIndex, yIndex, value]`: the first two numbers are the cell's x and y positions, and the third is the cell value.

```jsx
<Heatmap
  series={[
    {
      data: [
        [0, 2, 2.7], // Cell (0, 2) receives the value 2.7
        [1, 2, 4.5], // Cell (1, 2) receives the value 4.5
      ],
    },
  ]}
/>
```

Use the `xAxis` and `yAxis` props to set x and y ticks.

{{"demo": "BasicHeatmap.js"}}

## Color mapping

Use the `zAxis` configuration to customize color mapping.
You can use piecewise or continuous [value-based colors](/x/react-charts/styling/#value-based-colors).

{{"demo": "ColorConfig.js"}}

## Highlight

Set `highlightScope.highlight` to `'item'` to highlight the hovered cell.
Set `highlightScope.fade` to `'global'` to fade the other cells.

{{"demo": "HighlightHeatmap.js"}}

By default the highlight and fade use the CSS `filter: saturate(...)` property.
You can override it with the `heatmapClasses.highlighted` and `heatmapClasses.faded` classes.

The demo below uses border radius for the highlight and reduces saturation for faded cells.

{{"demo": "HighlightClasses.js"}}

## Click event

Use `onItemClick` to react when a cell is clicked.

The handler receives the click event as the first argument and an item object as the second.
The item has `xIndex` and `yIndex` (cell position on the x- and y-axes) and, when the cell has data, `dataIndex` (position in the series `data` array).

{{"demo": "HeatmapCellClick.js"}}

## Common features

The heatmap shares many features with other charts.
This section covers heatmap-specific details.
See the linked pages for shared features.

### Axes

Heatmap axes are customized like other chart axes.
See [Axis customization](/x/react-charts/axis/#axis-customization) for options.

### Tooltip

The heatmap has an item tooltip that you can customize as described in the [Tooltip](/x/react-charts/tooltip/) documentation.

The heatmap tooltip differs only in its default content.
Import the default tooltip or its content:

```js
import { HeatmapTooltip, HeatmapTooltipContent } from '@mui/x-charts/Heatmap';
```

### Legend

The heatmap includes a [`ContinuousColorLegend`](/x/react-charts/legend/#color-legend) by default.

Set `hideLegend` to `false` to show it.
Customize it with `slots.legend` and `slotProps.legend`.

{{"demo": "HeatmapLegend.js"}}

## Custom item

{{"demo": "CustomItem.js"}}

## WebGL renderer [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')🧪

:::info
This feature is in preview.
It is ready for production use, but its API, visuals and behavior may change in future minor or patch releases.
:::

Heatmaps can have many cells, which can slow down rendering.
Set the `renderer` prop to `'webgl'` for better performance with large datasets.

The WebGL renderer has some limitations:

- The `cell` slot is not supported
- Cells cannot be styled with CSS

The demo below shows roughly 8,800 cells rendered with WebGL.

{{"demo": "WebGLHeatmap.js"}}
