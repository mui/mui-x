# LineElement API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Areas demonstration](/x/react-charts/areas-demo/)
- [Charts - Line demonstration](/x/react-charts/line-demo/)
- [Charts - Lines](/x/react-charts/lines/)

## Import

```jsx
import { LineElement } from '@mui/x-charts/LineChart';
// or
import { LineElement } from '@mui/x-charts';
// or
import { LineElement } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| skipAnimation | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| line | `LineElementPath` | - | The component that renders the line. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | faded | Styles applied to the root element when faded. |
| - | highlighted | Styles applied to the root element when highlighted. |
| - | root | Styles applied to the root element. |
| - | series | Styles applied to the root element for a specified series.
Needs to be suffixed with the series ID: `.${lineElementClasses.series}-${seriesId}`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/LineChart/LineElement.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/LineChart/LineElement.tsx)