# ChartsAxis API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Axis](/x/react-charts/axis/)

## Import

```jsx
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
// or
import { ChartsAxis } from '@mui/x-charts';
// or
import { ChartsAxis } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

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

- [/packages/x-charts/src/ChartsAxis/ChartsAxis.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/ChartsAxis/ChartsAxis.tsx)