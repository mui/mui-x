# Gauge API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Gauge](/x/react-charts/gauge/)

## Import

```jsx
import { Gauge } from '@mui/x-charts/Gauge';
// or
import { Gauge } from '@mui/x-charts';
// or
import { Gauge } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| cornerRadius | `number \| string` | `0` | No |  |
| cx | `number \| string` | - | No |  |
| cy | `number \| string` | - | No |  |
| endAngle | `number` | `360` | No |  |
| height | `number` | - | No |  |
| id | `string` | - | No |  |
| innerRadius | `number \| string` | `'80%'` | No |  |
| margin | `number \| { bottom?: number, left?: number, right?: number, top?: number }` | - | No |  |
| outerRadius | `number \| string` | `'100%'` | No |  |
| skipAnimation | `bool` | - | No |  |
| startAngle | `number` | `0` | No |  |
| value | `number` | - | No |  |
| valueMax | `number` | `100` | No |  |
| valueMin | `number` | `0` | No |  |
| width | `number` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (SVGSVGElement).

> Any other props supplied will be provided to the root element (native element).

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | referenceArc | Styles applied to the arc displaying the range of available values. |
| - | root | Styles applied to the root element. |
| - | valueArc | Styles applied to the arc displaying the value. |
| - | valueText | Styles applied to the value text. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/Gauge/Gauge.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/Gauge/Gauge.tsx)