# PiecewiseColorLegend API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Legend](/x/react-charts/legend/)

## Import

```jsx
import { PiecewiseColorLegend } from '@mui/x-charts/ChartsLegend';
// or
import { PiecewiseColorLegend } from '@mui/x-charts';
// or
import { PiecewiseColorLegend } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| axisDirection | `'x' \| 'y' \| 'z'` | `'z'` | No |  |
| axisId | `number \| string` | `The first axis item.` | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| direction | `'horizontal' \| 'vertical'` | `'horizontal'` | No |  |
| labelFormatter | `function(params: PiecewiseLabelFormatterParams) => string \| null` | - | No |  |
| labelPosition | `'start' \| 'end' \| 'extremes'` | `'extremes'` | No |  |
| markType | `'square' \| 'circle' \| 'line'` | `'square'` | No |  |
| onItemClick | `function(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, legendItem: PiecewiseColorLegendItemContext, index: number) => void` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (HTMLUListElement).

> Any other props supplied will be provided to the root element (native element).

## Theme default props

You can use `MuiPiecewiseColorLegend` to change the default props of this component with the theme.

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | end | Styles applied to the legend with the labels after the color marks. |
| - | extremes | Styles applied to the legend with the labels on the extremes of the color marks. |
| - | horizontal | Styles applied to the legend in row layout. |
| - | item | Styles applied to the list items. |
| - | label | Styles applied to the series label. |
| - | mark | Styles applied to the marks. |
| - | maxLabel | Styles applied to the list item that renders the `maxLabel`. |
| - | minLabel | Styles applied to the list item that renders the `minLabel`. |
| - | root | Styles applied to the root element. |
| - | start | Styles applied to the legend with the labels before the color marks. |
| - | vertical | Styles applied to the legend in column layout. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/ChartsLegend/PiecewiseColorLegend.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/ChartsLegend/PiecewiseColorLegend.tsx)