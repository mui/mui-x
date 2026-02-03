---
title: Charts - Brush
productId: x-charts
components: ChartsBrushOverlay
---

# Charts - Brush

<p class="description">Let users select a region on a chart by clicking and dragging.</p>

The brush interaction enables users to select chart regions by clicking and dragging.
It captures the start and current positions of the selection, which you can use for:

- Highlighting trends or clusters within a defined range
<!-- - Zooming in on a selected region to focus on specific data points   -->
- Selecting data points for further inspection, editing, or annotation
- Triggering callbacks or custom events based on the selection area

The brush is available in the following chart types:

- `LineChart`
- `BarChart`
- `ScatterChart`

Visual feedback is provided through the `ChartsBrushOverlay` component.

## Implementing the brush feature

You can enable the brush by setting `brushConfig={{ enabled: true }}` in a Cartesian chart.

By default, the brush has no visual feedback.
To display the selected area, you can add the `ChartsBrushOverlay` component as a child of your chart.

To create a custom interaction, you can use the `useBrush()` hook as shown in the [Custom overlay](#custom-overlay) section below.

{{"demo": "BrushBasic.js"}}

## Customization examples

### Custom overlay

You can create a custom brush overlay by building your own component that uses the `useBrush()` hook.
The example below displays the values at the start and end positions, along with the difference and percentage change between them.

{{"demo": "BrushCustomOverlay.js"}}

### Data selection

You can use the brush to select and display data points within the selection area.
The example below shows a scatter chart where you can select points by dragging, and the selected points are displayed below the chart.

{{"demo": "BrushScatterList.js"}}

### Using the `useBrush()` hook

The `useBrush()` hook provides access to the current brush state.
It returns an object with:

- `start`: The starting point of the brush selection (`{ x: number, y: number } | null`)
- `current`: The current point of the brush selection (`{ x: number, y: number } | null`)

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

The `brushConfig` prop accepts an object with the following boolean options:

- `enabled` (default: `false`): Whether the brush interaction is enabled
- `preventTooltip` (default: `true`): Whether to prevent tooltip from showing during brush interaction
- `preventHighlight` (default: `true`): Whether to prevent highlighting during brush interaction

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
