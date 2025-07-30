# RadarGrid API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Radar](/x/react-charts/radar/)

## Import

```jsx
import { RadarGrid } from '@mui/x-charts/RadarChart';
// or
import { RadarGrid } from '@mui/x-charts';
// or
import { RadarGrid } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| divisions | `number` | `5` | No |  |
| shape | `'circular' \| 'sharp'` | `'sharp'` | No |  |
| stripeColor | `function(index: number) => string` | `(index) => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | divider | Styles applied to every divider element. |
| - | radial | Styles applied to every radial line element. |
| - | stripe | Styles applied to every stripe element. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/RadarChart/RadarGrid/RadarGrid.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/RadarChart/RadarGrid/RadarGrid.tsx)