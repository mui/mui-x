# ChartsReferenceLine API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Axis](/x/react-charts/axis/)

## Import

```jsx
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
// or
import { ChartsReferenceLine } from '@mui/x-charts';
// or
import { ChartsReferenceLine } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| axisId | `number \| string` | `The `id` of the first defined axis.` | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| label | `string` | - | No |  |
| labelAlign | `'end' \| 'middle' \| 'start'` | `'middle'` | No |  |
| labelStyle | `object` | - | No |  |
| lineStyle | `object` | - | No |  |
| spacing | `number \| { x?: number, y?: number }` | `5` | No |  |
| x | `Date \| number \| string` | - | No |  |
| y | `Date \| number \| string` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | horizontal | Styles applied to the root element if the reference line is horizontal. |
| - | label | Styles applied to the reference label. |
| - | line | Styles applied to the reference line. |
| - | root | Styles applied to the root element. |
| - | vertical | Styles applied to the root element if the reference line is vertical. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/ChartsReferenceLine/ChartsReferenceLine.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/ChartsReferenceLine/ChartsReferenceLine.tsx)