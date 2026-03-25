---
title: React Heatmap chart
productId: x-charts
components: Heatmap, HeatmapPlot, HeatmapTooltip, HeatmapTooltipContent, FocusedHeatmapCell, HeatmapPremium
---

# Charts - Heatmap [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Use heatmap charts to show intensity as a grid of colored cells across two dimensions.</p>

## Overview

A heatmap shows how a numeric value varies across two dimensions as a grid of colored cells.
Each cell is the intersection of an x and y category or tick, and color encodes the value.

Use heatmaps to spot areas of higher or lower intensity, clusters, or anomalies.

The demo below shows bicycle counts in Paris by day and hour.

{{"demo": "HeatmapDemo.js", "disableAd": true, "defaultCodeOpen": false}}

## Basics

A heatmap series must include a `data` property with an array of 3-tuples.
Each tuple is `[xIndex, yIndex, value]`.
The first two numbers are the cell's x and y indices, and the third is the cell value.

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

Use the `zAxis` configuration to customize how values map to color.
You can use piecewise or continuous scales.
See [Styling—Value-based colors](/x/react-charts/styling/#value-based-colors) for details.

{{"demo": "ColorConfig.js"}}

## Highlight

Set `highlightScope.highlight` to `'item'` to highlight the hovered cell.
Set `highlightScope.fade` to `'global'` to fade the other cells.

{{"demo": "HighlightHeatmap.js"}}

By default, the highlight and fade use the CSS `filter: saturate(...)` property.
You can override the effect with the `heatmapClasses.highlighted` and `heatmapClasses.faded` classes.

The demo below uses border radius on the highlighted cell and reduced saturation for faded cells.

{{"demo": "HighlightClasses.js"}}

## Click events

Use `onItemClick` to handle cell clicks.

The handler receives the click event as the first argument and an item object as the second.
The item includes `xIndex` and `yIndex` (cell position on the x- and y-axes) and, when the cell has data, `dataIndex` (index in the series `data` array).

{{"demo": "HeatmapCellClick.js"}}

## Shared features

Heatmap charts use the same axis, tooltip, and legend patterns as other charts.
This section notes heatmap-specific details.
See the linked pages for full options.

### Axes

You can configure heatmap axes like other chart axes.
See [Axis—Customization](/x/react-charts/axis/#axis-customization) for details.

### Tooltip

The default heatmap tooltip is item-based.
You can customize it with slots.
See [Tooltip](/x/react-charts/tooltip/) for details.

The heatmap package exports the default tooltip and its content if you want to reuse or extend them:

```js
import { HeatmapTooltip, HeatmapTooltipContent } from '@mui/x-charts/Heatmap';
```

### Legend

The heatmap includes a [`ContinuousColorLegend`](/x/react-charts/legend/#color-legend) by default.

Set `hideLegend` to `true` to hide the legend.
Customize it with `slots.legend` and `slotProps.legend`.

{{"demo": "HeatmapLegend.js"}}

## Custom cells

Use the `cell` slot to replace the default cell shape or add labels.

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
- You cannot style cells with CSS

The demo below shows roughly 8,800 cells rendered with WebGL.

{{"demo": "WebGLHeatmap.js"}}
