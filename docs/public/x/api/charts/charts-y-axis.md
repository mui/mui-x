# ChartsYAxis API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Axis](/x/react-charts/axis/)

## Import

```jsx
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
// or
import { ChartsYAxis } from '@mui/x-charts';
// or
import { ChartsYAxis } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| axisId | `number \| string` | - | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| disableLine | `bool` | `false` | No |  |
| disableTicks | `bool` | `false` | No |  |
| fill | `string` | `'currentColor'` | No |  |
| label | `string` | - | No |  |
| labelStyle | `object` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| stroke | `string` | `'currentColor'` | No |  |
| tickInterval | `'auto' \| array \| func` | `'auto'` | No |  |
| tickLabelInterval | `'auto' \| func` | `'auto'` | No |  |
| tickLabelPlacement | `'middle' \| 'tick'` | `'middle'` | No |  |
| tickLabelStyle | `object` | - | No |  |
| tickMaxStep | `number` | - | No |  |
| tickMinStep | `number` | - | No |  |
| tickNumber | `number` | - | No |  |
| tickPlacement | `'end' \| 'extremities' \| 'middle' \| 'start'` | `'extremities'` | No |  |
| tickSize | `number` | `6` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | bottom | Styles applied to the bottom axis. |
| - | directionX | Styles applied to x-axes. |
| - | directionY | Styles applied to y-axes. |
| - | id | Styles applied to the root element for the axis with the given ID.
Needs to be suffixed with the axis ID: `.${axisClasses.id}-${axisId}`. |
| - | label | Styles applied to the group containing the axis label. |
| - | left | Styles applied to the left axis. |
| - | line | Styles applied to the main line element. |
| - | right | Styles applied to the right axis. |
| - | root | Styles applied to the root element. |
| - | tick | Styles applied to ticks. |
| - | tickContainer | Styles applied to group including the tick and its label. |
| - | tickLabel | Styles applied to ticks label.

⚠️ For performance reasons, only the inline styles get considered for bounding box computation.
Modifying text size by adding properties like `font-size` or `letter-spacing` to this class might cause labels to overlap. |
| - | top | Styles applied to the top axis. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/ChartsYAxis/ChartsYAxis.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/ChartsYAxis/ChartsYAxis.tsx)