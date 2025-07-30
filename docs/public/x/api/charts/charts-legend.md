# ChartsLegend API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Legend](/x/react-charts/legend/)

## Import

```jsx
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
// or
import { ChartsLegend } from '@mui/x-charts';
// or
import { ChartsLegend } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| direction | `'horizontal' \| 'vertical'` | - | No |  |
| onItemClick | `function(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, legendItem: SeriesLegendItemContext, index: number) => void` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLUListElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiChartsLegend` to change the default props of this component with the theme.

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| legend | `ChartsLegend` | - | Custom rendering of the legend. |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | horizontal | Styles applied to the legend in row layout. |
| - | item | Styles applied to the list item around each series in the legend. |
| - | label | Styles applied to the series label. |
| - | mark | Styles applied to series mark element. |
| - | root | Styles applied to the root element. |
| - | series | Styles applied to a series element. |
| - | vertical | Styles applied to the legend in column layout. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/ChartsLegend/ChartsLegend.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/ChartsLegend/ChartsLegend.tsx)