# Heatmap API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Charts - Export
- Charts - Heatmap

## Import

```jsx
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
// or
import { Heatmap } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| series | `Array<object>` | - | Yes |  |
| xAxis | `Array<{ axis?: 'x', barGapRatio?: number, categoryGapRatio?: number, classes?: object, colorMap?: { colors: Array<string>, type: 'ordinal', unknownColor?: string, values?: Array<Date \| number \| string> } \| { color: Array<string> \| func, max?: Date \| number, min?: Date \| number, type: 'continuous' } \| { colors: Array<string>, thresholds: Array<Date \| number>, type: 'piecewise' }, data?: array, dataKey?: string, disableLine?: bool, disableTicks?: bool, domainLimit?: 'nice' \| 'strict' \| func, fill?: string, height?: number, hideTooltip?: bool, id?: number \| string, ignoreTooltip?: bool, label?: string, labelStyle?: object, max?: Date \| number, min?: Date \| number, offset?: number, position?: 'bottom' \| 'none' \| 'top', reverse?: bool, scaleType?: 'band', slotProps?: object, slots?: object, stroke?: string, sx?: Array<func \| object \| bool> \| func \| object, tickInterval?: 'auto' \| array \| func, tickLabelInterval?: 'auto' \| func, tickLabelMinGap?: number, tickLabelPlacement?: 'middle' \| 'tick', tickLabelStyle?: object, tickMaxStep?: number, tickMinStep?: number, tickNumber?: number, tickPlacement?: 'end' \| 'extremities' \| 'middle' \| 'start', tickSize?: number, valueFormatter?: func }>` | - | Yes |  |
| yAxis | `Array<{ axis?: 'y', barGapRatio?: number, categoryGapRatio?: number, classes?: object, colorMap?: { colors: Array<string>, type: 'ordinal', unknownColor?: string, values?: Array<Date \| number \| string> } \| { color: Array<string> \| func, max?: Date \| number, min?: Date \| number, type: 'continuous' } \| { colors: Array<string>, thresholds: Array<Date \| number>, type: 'piecewise' }, data?: array, dataKey?: string, disableLine?: bool, disableTicks?: bool, domainLimit?: 'nice' \| 'strict' \| func, fill?: string, hideTooltip?: bool, id?: number \| string, ignoreTooltip?: bool, label?: string, labelStyle?: object, max?: Date \| number, min?: Date \| number, offset?: number, position?: 'left' \| 'none' \| 'right', reverse?: bool, scaleType?: 'band', slotProps?: object, slots?: object, stroke?: string, sx?: Array<func \| object \| bool> \| func \| object, tickInterval?: 'auto' \| array \| func, tickLabelInterval?: 'auto' \| func, tickLabelPlacement?: 'middle' \| 'tick', tickLabelStyle?: object, tickMaxStep?: number, tickMinStep?: number, tickNumber?: number, tickPlacement?: 'end' \| 'extremities' \| 'middle' \| 'start', tickSize?: number, valueFormatter?: func, width?: number }>` | - | Yes |  |
| colors | `Array<string> \| func` | `rainbowSurgePalette` | No |  |
| dataset | `Array<object>` | - | No |  |
| disableAxisListener | `bool` | `false` | No |  |
| height | `number` | - | No |  |
| hideLegend | `bool` | `true` | No |  |
| highlightedItem | `{ dataIndex?: number, seriesId: number \| string }` | - | No |  |
| id | `string` | - | No |  |
| loading | `bool` | `false` | No |  |
| localeText | `object` | - | No |  |
| margin | `number \| { bottom?: number, left?: number, right?: number, top?: number }` | - | No |  |
| onAxisClick | `function(event: MouseEvent, data: null \| ChartsAxisData) => void` | - | No |  |
| onHighlightChange | `function(highlightedItem: HighlightItemData \| null) => void` | - | No |  |
| showToolbar | `bool` | `false` | No |  |
| slotProps | `object` | `{}` | No |  |
| slots | `object` | `{}` | No |  |
| tooltip | `object` | - | No |  |
| width | `number` | - | No |  |
| zAxis | `Array<{ colorMap?: { colors: Array<string>, type: 'ordinal', unknownColor?: string, values?: Array<Date \| number \| string> } \| { color: Array<string> \| func, max?: Date \| number, min?: Date \| number, type: 'continuous' } \| { colors: Array<string>, thresholds: Array<Date \| number>, type: 'piecewise' }, data?: array, dataKey?: string, id?: string, max?: number, min?: number }>` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

> Any other props supplied will be provided to the root element (native element).

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | cell | Styles applied to the heatmap cells. |
| - | faded | Styles applied to the cell element if faded. |
| - | highlighted | Styles applied to the cell element if highlighted. |
| - | series | Styles applied to the root element for a specified series.
Needs to be suffixed with the series ID: `.${heatmapClasses.series}-${seriesId}`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts-pro/src/Heatmap/Heatmap.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts-pro/src/Heatmap/Heatmap.tsx)