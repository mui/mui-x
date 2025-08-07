# BarPlot API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Bar demonstration](/x/react-charts/bar-demo/)
- [Charts - Bars](/x/react-charts/bars/)

## Import

```jsx
import { BarPlot } from '@mui/x-charts/BarChart';
// or
import { BarPlot } from '@mui/x-charts';
// or
import { BarPlot } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| barLabel | `'value' \| func` | - | No |  |
| borderRadius | `number` | - | No |  |
| onItemClick | `function(event: React.MouseEvent<SVGElement, MouseEvent>, barItemIdentifier: BarItemIdentifier) => void` | - | No |  |
| skipAnimation | `bool` | `undefined` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| bar | `BarElementPath` | - | The component that renders the bar. |
| barLabel | `BarLabel` | - | The component that renders the bar label. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/BarChart/BarPlot.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/BarChart/BarPlot.tsx)