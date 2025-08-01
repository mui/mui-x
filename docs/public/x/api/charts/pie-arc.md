# PieArc API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Pie](/x/react-charts/pie/)
- [Charts - Pie demonstration](/x/react-charts/pie-demo/)

## Import

```jsx
import { PieArc } from '@mui/x-charts/PieChart';
// or
import { PieArc } from '@mui/x-charts';
// or
import { PieArc } from '@mui/x-charts-pro';
```

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | faded | Styles applied to the root element when faded. |
| - | highlighted | Styles applied to the root element when highlighted. |
| - | root | Styles applied to the root element. |
| - | series | Styles applied to the root element for a specified series.
Needs to be suffixed with the series ID: `.${pieArcClasses.series}-${seriesId}`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/PieChart/PieArc.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/PieChart/PieArc.tsx)