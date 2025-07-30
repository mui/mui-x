# PieChart API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Charts - Label](/x/react-charts/label/)
- [Charts - Pie](/x/react-charts/pie/)
- [Charts - Pie demonstration](/x/react-charts/pie-demo/)

## Import

```jsx
import { PieChart } from '@mui/x-charts/PieChart';
// or
import { PieChart } from '@mui/x-charts';
// or
import { PieChart } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| series | `Array<object>` | - | Yes |  |
| colors | `Array<string> \| func` | `rainbowSurgePalette` | No |  |
| dataset | `Array<object>` | - | No |  |
| height | `number` | - | No |  |
| hideLegend | `bool` | - | No |  |
| highlightedItem | `{ dataIndex?: number, seriesId: number \| string }` | - | No |  |
| id | `string` | - | No |  |
| loading | `bool` | `false` | No |  |
| localeText | `object` | - | No |  |
| margin | `number \| { bottom?: number, left?: number, right?: number, top?: number }` | - | No |  |
| onHighlightChange | `function(highlightedItem: HighlightItemData \| null) => void` | - | No |  |
| onItemClick | `func` | - | No |  |
| showToolbar | `bool` | `false` | No |  |
| skipAnimation | `bool` | - | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| width | `number` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (SVGSVGElement).

> Any other props supplied will be provided to the root element (native element).

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| baseButton | `undefined` | - |  |
| baseIconButton | `undefined` | - |  |
| legend | `ChartsLegend` | - | Custom rendering of the legend. |
| loadingOverlay | `ChartsLoadingOverlay` | - | Overlay component rendered when the chart is in a loading state. |
| noDataOverlay | `ChartsNoDataOverlay` | - | Overlay component rendered when the chart has no data to display. |
| pieArc | `undefined` | - |  |
| pieArcLabel | `undefined` | - |  |
| toolbar | `ChartsToolbar` | - | Custom component for the toolbar. |
| tooltip | `ChartsTooltipRoot` | - | Custom component for the tooltip popper. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts/src/PieChart/PieChart.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts/src/PieChart/PieChart.tsx)