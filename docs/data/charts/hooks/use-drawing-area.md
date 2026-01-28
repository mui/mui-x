---
title: Charts - useDrawingArea
productId: x-charts
---

# useDrawingArea

<p class="description">Access the chart's drawing area dimensions and coordinates.</p>

The `useDrawingArea` hook provides access to the chart's drawing area dimensions and positioning, which is useful for positioning custom elements within the chart area.

## Usage

```js
import { useDrawingArea } from '@mui/x-charts/hooks';

function CustomOverlay() {
  const { left, right, top, bottom, width, height } = useDrawingArea();
  // Position custom elements within the chart area
}
```

This demo displays:

- A red dashed border showing the exact drawing area boundaries
- Corner markers at each corner of the drawing area
- A center cross marking the middle of the drawing area
- Real-time dimension and center point information

{{"demo": "UseDrawingArea.js"}}

## Return value

The hook returns an object with the following properties:

| Property | Type     | Description                                                        |
| :------- | :------- | :----------------------------------------------------------------- |
| `left`   | `number` | The gap between the left border of the SVG and the drawing area.   |
| `right`  | `number` | The gap between the right border of the SVG and the drawing area.  |
| `top`    | `number` | The gap between the top border of the SVG and the drawing area.    |
| `bottom` | `number` | The gap between the bottom border of the SVG and the drawing area. |
| `width`  | `number` | The width of the drawing area.                                     |
| `height` | `number` | The height of the drawing area.                                    |

## Caveats

This hook must be used within a chart context. See the [hooks overview](/x/react-charts/hooks/) for more information about proper usage.
