# Scatter API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Scatter demonstration](/x/react-charts/scatter-demo/)

## Import

```jsx
import { Scatter } from '@mui/x-charts/ScatterChart';
// or
import { Scatter } from '@mui/x-charts';
// or
import { Scatter } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| onItemClick | `function(event: MouseEvent, scatterItemIdentifier: ScatterItemIdentifier) => void` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| marker | `ScatterMarker` | - | The component that renders the marker for a scatter point. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/ScatterChart/Scatter.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/ScatterChart/Scatter.tsx)