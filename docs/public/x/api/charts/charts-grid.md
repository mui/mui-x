# ChartsGrid API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Bars](/x/react-charts/bars/)
- [Chart composition](/x/react-charts/composition/)
- [Charts - Lines](/x/react-charts/lines/)
- [Charts - Scatter](/x/react-charts/scatter/)

## Import

```jsx
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
// or
import { ChartsGrid } from '@mui/x-charts';
// or
import { ChartsGrid } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| horizontal | `bool` | - | No |  |
| vertical | `bool` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

> Any other props supplied will be provided to the root element (native element).

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | horizontalLine | Styles applied to x-axes. |
| - | line | Styles applied to every line element. |
| - | root | Styles applied to the root element. |
| - | verticalLine | Styles applied to y-axes. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/ChartsGrid/ChartsGrid.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/ChartsGrid/ChartsGrid.tsx)