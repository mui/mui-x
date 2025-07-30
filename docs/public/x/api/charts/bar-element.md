# BarElement API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Bar demonstration](/x/react-charts/bar-demo/)
- [Charts - Bars](/x/react-charts/bars/)

## Import

```jsx
import { BarElement } from '@mui/x-charts/BarChart';
// or
import { BarElement } from '@mui/x-charts';
// or
import { BarElement } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| bar | `BarElementPath` | - | The component that renders the bar. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | faded | Styles applied to the root element if it is faded. |
| - | highlighted | Styles applied to the root element if it is highlighted. |
| - | root | Styles applied to the root element. |
| - | series | Styles applied to the root element for a specified series.
Needs to be suffixed with the series ID: `.${barElementClasses.series}-${seriesId}`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/BarChart/BarElement.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/BarChart/BarElement.tsx)