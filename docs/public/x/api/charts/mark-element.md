# MarkElement API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Areas demonstration](/x/react-charts/areas-demo/)
- [Charts - Line demonstration](/x/react-charts/line-demo/)
- [Charts - Lines](/x/react-charts/lines/)

## Import

```jsx
import { MarkElement } from '@mui/x-charts/LineChart';
// or
import { MarkElement } from '@mui/x-charts';
// or
import { MarkElement } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| dataIndex | `number` | - | Yes |  |
| shape | `'circle' \| 'cross' \| 'diamond' \| 'square' \| 'star' \| 'triangle' \| 'wye'` | - | Yes |  |
| isFaded | `bool` | `false` | No |  |
| isHighlighted | `bool` | `false` | No |  |
| skipAnimation | `bool` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | animate | Styles applied to the root element when animation is not skipped. |
| - | faded | Styles applied to the root element when faded. |
| - | highlighted | Styles applied to the root element when highlighted. |
| - | root | Styles applied to the root element. |
| - | series | Styles applied to the root element for a specified series.
Needs to be suffixed with the series ID: `.${markElementClasses.series}-${seriesId}`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/LineChart/MarkElement.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/LineChart/MarkElement.tsx)