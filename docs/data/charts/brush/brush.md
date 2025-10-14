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

- Selecting data ranges
- Highlighting specific areas
- Creating custom interactions
- Zooming (when combined with the zoom plugin in Pro charts)

The brush plugin is available in all chart types and provides visual feedback through the `ChartsBrushOverlay` component.

## Basic usage

To display visual feedback when users interact with the chart, add the `ChartsBrushOverlay` component as a child of your chart.

{{"demo": "BrushBasic.js"}}

The brush overlay automatically handles:

- Mouse and touch interactions
- Visual rendering of the selection area
- Coordinate tracking

## Custom overlay

You can create a custom brush overlay by building your own component that uses the `useBrush` hook.
This example shows how to add labeled start and end lines to the brush selection:

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

## Usage with composition

When using chart composition with `ChartContainer`, you can add the brush overlay as a child component:

```jsx
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import { LinePlot } from '@mui/x-charts/LineChart';

function MyChart() {
  return (
    <ChartContainer
      series={[{ type: 'line', data: [1, 2, 3] }]}
      width={500}
      height={300}
    >
      <LinePlot />
      <ChartsBrushOverlay />
    </ChartContainer>
  );
}
```

## API Reference

### useBrush Hook

```tsx
import { useBrush } from '@mui/x-charts/hooks';

const { start, current } = useBrush();
```

**Returns:**

- `start` - The starting point of the brush selection (`{ x: number, y: number } | null`)
- `current` - The current point of the brush selection (`{ x: number, y: number } | null`)

### Brush Plugin Methods

The brush plugin also provides instance methods that can be accessed via the chart context:

- `setBrushCoordinates(point)` - Manually set the brush coordinates
- `clearBrush()` - Clear the current brush selection

Where `point` is `{ x: number, y: number } | null`.

## Integration with Zoom

In Pro charts (`LineChartPro`, `BarChartPro`, `ScatterChartPro`), the brush can be used as a zoom interaction.
See the [Zoom and Pan documentation](/x/react-charts/zoom-and-pan/) for more details on using brush for zooming.
