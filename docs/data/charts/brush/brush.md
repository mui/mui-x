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

- Highlighting specific areas
- Creating custom interactions

The brush plugin is available in the `LineChart`, `BarChart`, and `ScatterChart` types and provides visual feedback through the `ChartsBrushOverlay` component.

## Basic usage

To display visual feedback when users interact with the chart, enable the brush with `brushConfig={{ enabled: true }}` and add the `ChartsBrushOverlay` component as a child of your chart.

{{"demo": "BrushBasic.js"}}

## Custom overlay

You can create a custom brush overlay by building your own component that uses the `useBrush` hook.
This example shows how to display the difference between the start and current positions of the brush selection.

{{"demo": "BrushCustomOverlay.js"}}

### Using the useBrush hook

The `useBrush` hook provides access to the current brush state:

```jsx
import { useBrush } from '@mui/x-charts/hooks';

function MyCustomOverlay() {
  const { start, current } = useBrush();

  if (!start || !current) {
    return null;
  }

  // start.x, start.y - The coordinates where the brush started
  // current.x, current.y - The current coordinates of the brush

  return <g>{/* Your custom overlay */}</g>;
}
```

The hook returns an object with:

- `start` - The starting point of the brush selection (`{ x: number, y: number } | null`)
- `current` - The current point of the brush selection (`{ x: number, y: number } | null`)

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
