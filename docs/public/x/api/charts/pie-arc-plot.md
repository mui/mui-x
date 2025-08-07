# PieArcPlot API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Pie](/x/react-charts/pie/)
- [Charts - Pie demonstration](/x/react-charts/pie-demo/)

## Import

```jsx
import { PieArcPlot } from '@mui/x-charts/PieChart';
// or
import { PieArcPlot } from '@mui/x-charts';
// or
import { PieArcPlot } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| id | `number \| string` | - | Yes |  |
| outerRadius | `number` | - | Yes |  |
| arcLabelRadius | `number` | `(innerRadius - outerRadius) / 2` | No |  |
| cornerRadius | `number` | `0` | No |  |
| faded | `{ additionalRadius?: number, arcLabelRadius?: number, color?: string, cornerRadius?: number, innerRadius?: number, outerRadius?: number, paddingAngle?: number }` | `{ additionalRadius: -5 }` | No |  |
| highlighted | `{ additionalRadius?: number, arcLabelRadius?: number, color?: string, cornerRadius?: number, innerRadius?: number, outerRadius?: number, paddingAngle?: number }` | - | No |  |
| innerRadius | `number` | `0` | No |  |
| onItemClick | `function(event: React.MouseEvent<SVGPathElement, MouseEvent>, pieItemIdentifier: PieItemIdentifier, item: DefaultizedPieValueType) => void` | - | No |  |
| paddingAngle | `number` | `0` | No |  |
| skipAnimation | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| pieArc | `undefined` | - |  |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/PieChart/PieArcPlot.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/PieChart/PieArcPlot.tsx)