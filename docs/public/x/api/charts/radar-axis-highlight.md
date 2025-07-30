# RadarAxisHighlight API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Radar](/x/react-charts/radar/)

## Import

```jsx
import { RadarAxisHighlight } from '@mui/x-charts/RadarChart';
// or
import { RadarAxisHighlight } from '@mui/x-charts';
// or
import { RadarAxisHighlight } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | dot | Styles applied to every highlight dot. |
| - | line | Styles applied to the highlighted axis line element. |
| - | root | Styles applied to the root element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/RadarChart/RadarAxisHighlight/RadarAxisHighlight.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/RadarChart/RadarAxisHighlight/RadarAxisHighlight.tsx)