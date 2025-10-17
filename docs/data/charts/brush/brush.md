---
title: Charts - Brush
productId: x-charts
components: ChartsBrushOverlay
---

# Charts - Brush

<p class="description">The brush interaction allows users to select a region on the chart by clicking and dragging.</p>

## Overview

The brush feature provides a way to track user selections on charts through a click-and-drag interaction.
It captures the start and current positions of the user's selection, which can be used for various purposes such as:

- Highlighting trends or clusters within a defined range
<!-- - Zooming in on a selected region to focus on specific data points   -->
- Selecting data points for further inspection, editing, or annotation
- Triggering callbacks or custom events based on the selection area

The brush is available in the `LineChart`, `BarChart`, and `ScatterChart` types and provides visual feedback through the `ChartsBrushOverlay` component.

## Basic usage

The brush gesture can be enabled by setting `brushConfig={{ enabled: true }}` in a cartesian chart.

By default, the brush gesture has no visual feedback. If you want to see the selected area, you can add the `ChartsBrushOverlay` component as a child of your chart.

Alternatively, if you want to create a custom interaction, you can use the `useBrush` hook, as shown in the [Custom overlay](#custom-overlay) section below.

{{"demo": "BrushBasic.js"}}

## Customization examples

### Custom overlay

You can create a custom brush overlay by building your own component that uses the `useBrush` hook.
This example shows how to display the values at the start and end positions, along with the difference and percentage change between them.

{{"demo": "BrushCustomOverlay.js"}}

### Data selection

The brush can also be used to select and display data points within the selection area.
This example shows a scatter chart where you can select points by dragging, and the selected points are displayed below the chart.

{{"demo": "BrushScatterList.js"}}

### Using the `useBrush` hook

The `useBrush` hook provides access to the current brush state.

The hook returns an object with:

- `start` - The starting point of the brush selection (`{ x: number, y: number } | null`)
- `current` - The current point of the brush selection (`{ x: number, y: number } | null`)

```jsx
import { useBrush } from '@mui/x-charts/hooks';

function MyCustomOverlay() {
  const brush = useBrush();

  // No brush is in progress
  if (!brush) {
    return null;
  }

  const { start, current } = brush;

  // start.x, start.y - The coordinates where the brush started
  // current.x, current.y - The current coordinates of the brush

  return <g>{/* Your custom overlay */}</g>;
}
```

## Configuration

The `brushConfig` prop accepts an object with the following options:

- `enabled` (boolean, default: `false`) - Whether the brush interaction is enabled
- `preventTooltip` (boolean, default: `true`) - Whether to prevent tooltip from showing during brush interaction
- `preventHighlight` (boolean, default: `true`) - Whether to prevent highlighting during brush interaction

Example:

```jsx
<LineChart
  brushConfig={{
    enabled: true,
    preventTooltip: true,
    preventHighlight: true,
  }}
  // ... other props
/>
```

<!-- ## Integration with Zoom

In Pro charts (`LineChartPro`, `BarChartPro`, `ScatterChartPro`), the brush can be used as a zoom interaction.
See the [Zoom and Pan documentation](/x/react-charts/zoom-and-pan/) for more details on using brush for zooming. -->
