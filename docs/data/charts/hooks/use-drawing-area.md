---
title: Charts - useDrawingArea
productId: x-charts
---

# useDrawingArea

<p class="description">Get the chart's drawing area dimensions and coordinates for positioning custom content.</p>

`useDrawingArea()` returns the chart's drawing area dimensions and position.
You can use it to position custom elements inside the chart area.

## Usage

```js
import { useDrawingArea } from '@mui/x-charts/hooks';

function CustomOverlay() {
  const { left, right, top, bottom, width, height } = useDrawingArea();
  // Position custom elements within the chart area
}
```

The demo below shows:

- A red dashed border showing the exact drawing area boundaries
- Corner markers at each corner of the drawing area
- A center cross marking the middle of the drawing area
- Real-time dimension and center point information

{{"demo": "UseDrawingArea.js"}}

## Return value

`useDrawingArea()` returns an object with the following properties:

| Property | Type     | Description                                                        |
| :------- | :------- | :----------------------------------------------------------------- |
| `left`   | `number` | The gap between the left border of the SVG and the drawing area.   |
| `right`  | `number` | The gap between the right border of the SVG and the drawing area.  |
| `top`    | `number` | The gap between the top border of the SVG and the drawing area.    |
| `bottom` | `number` | The gap between the bottom border of the SVG and the drawing area. |
| `width`  | `number` | The width of the drawing area.                                     |
| `height` | `number` | The height of the drawing area.                                    |

## Caveats

You can only use these hooks within a chart context.
See the [hooks overview](/x/react-charts/hooks/) for usage requirements.
