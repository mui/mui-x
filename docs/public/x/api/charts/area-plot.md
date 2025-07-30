# AreaPlot API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Areas demonstration](/x/react-charts/areas-demo/)
- [Charts - Lines](/x/react-charts/lines/)

## Import

```jsx
import { AreaPlot } from '@mui/x-charts/LineChart';
// or
import { AreaPlot } from '@mui/x-charts';
// or
import { AreaPlot } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| onItemClick | `function(event: React.MouseEvent<SVGPathElement, MouseEvent>, lineItemIdentifier: LineItemIdentifier) => void` | - | No |  |
| skipAnimation | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| area | `AnimatedArea` | - | The component that renders the area. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/LineChart/AreaPlot.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/LineChart/AreaPlot.tsx)