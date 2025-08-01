# BarLabel API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Bars](/x/react-charts/bars/)

## Import

```jsx
import { BarLabel } from '@mui/x-charts/BarChart';
// or
import { BarLabel } from '@mui/x-charts';
// or
import { BarLabel } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| height | `number` | - | Yes |  |
| width | `number` | - | Yes |  |
| x | `number` | - | Yes |  |
| xOrigin | `number` | - | Yes |  |
| y | `number` | - | Yes |  |
| yOrigin | `number` | - | Yes |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| barLabel | `BarLabel` | - | The component that renders the bar label. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | animate | Styles applied to the root element if it is animated. |
| - | faded | Styles applied to the root element if it is faded. |
| - | highlighted | Styles applied to the root element if it is highlighted. |
| - | root | Styles applied to the root element. |
| - | series | Styles applied to the root element for a specified series.
Needs to be suffixed with the series ID: `.${barLabelClasses.series}-${seriesId}`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/BarChart/BarLabel/BarLabel.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/BarChart/BarLabel/BarLabel.tsx)