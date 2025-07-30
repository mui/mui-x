# FunnelPlot API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Charts - Funnel 🧪
- Charts - Pyramid 🧪

## Import

```jsx
import { FunnelPlot } from '@mui/x-charts-pro/FunnelChart';
// or
import { FunnelPlot } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| onItemClick | `function(event: React.MouseEvent<SVGElement, MouseEvent>, funnelItemIdentifier: FunnelItemIdentifier) => void` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts-pro/src/FunnelChart/FunnelPlot.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts-pro/src/FunnelChart/FunnelPlot.tsx)