# ChartContainerPro API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Chart composition](/x/react-charts/composition/)

## Import

```jsx
import { ChartContainerPro } from '@mui/x-charts-pro/ChartContainerPro';
// or
import { ChartContainerPro } from '@mui/x-charts-pro';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| colors | `Array<string> \| func` | `blueberryTwilightPalette` | No |  |
| dataset | `Array<object>` | - | No |  |
| disableAxisListener | `bool` | `false` | No |  |
| height | `number` | - | No |  |
| highlightedItem | `{ dataIndex?: number, seriesId: number \| string }` | - | No |  |
| id | `string` | - | No |  |
| initialZoom | `Array<{ axisId: number \| string, end: number, start: number }>` | - | No |  |
| margin | `{ bottom?: number, left?: number, right?: number, top?: number }` | - | No |  |
| onHighlightChange | `function(highlightedItem: HighlightItemData \| null) => void` | - | No |  |
| onZoomChange | `function(zoomData: Array<ZoomData>) => void` | - | No |  |
| series | `Array<object>` | - | No |  |
| skipAnimation | `bool` | - | No |  |
| width | `number` | - | No |  |
| xAxis | `Array<{ classes?: object, colorMap?: { colors: Array<string>, type: 'ordinal', unknownColor?: string, values?: Array<Date \| number \| string> } \| { color: Array<string> \| func, max?: Date \| number, min?: Date \| number, type: 'continuous' } \| { colors: Array<string>, thresholds: Array<Date \| number>, type: 'piecewise' }, data?: array, dataKey?: string, disableLine?: bool, disableTicks?: bool, domainLimit?: 'nice' \| 'strict' \| func, fill?: string, hideTooltip?: bool, id?: number \| string, label?: string, labelStyle?: object, max?: Date \| number, min?: Date \| number, position?: 'bottom' \| 'top', reverse?: bool, scaleType?: 'band' \| 'linear' \| 'log' \| 'point' \| 'pow' \| 'sqrt' \| 'time' \| 'utc', slotProps?: object, slots?: object, stroke?: string, sx?: Array<func \| object \| bool> \| func \| object, tickInterval?: 'auto' \| array \| func, tickLabelInterval?: 'auto' \| func, tickLabelPlacement?: 'middle' \| 'tick', tickLabelStyle?: object, tickMaxStep?: number, tickMinStep?: number, tickNumber?: number, tickPlacement?: 'end' \| 'extremities' \| 'middle' \| 'start', tickSize?: number, valueFormatter?: func, zoom?: { filterMode?: 'discard' \| 'keep', maxEnd?: number, maxSpan?: number, minSpan?: number, minStart?: number, panning?: bool, step?: number } \| bool }>` | - | No |  |
| yAxis | `Array<{ classes?: object, colorMap?: { colors: Array<string>, type: 'ordinal', unknownColor?: string, values?: Array<Date \| number \| string> } \| { color: Array<string> \| func, max?: Date \| number, min?: Date \| number, type: 'continuous' } \| { colors: Array<string>, thresholds: Array<Date \| number>, type: 'piecewise' }, data?: array, dataKey?: string, disableLine?: bool, disableTicks?: bool, domainLimit?: 'nice' \| 'strict' \| func, fill?: string, hideTooltip?: bool, id?: number \| string, label?: string, labelStyle?: object, max?: Date \| number, min?: Date \| number, position?: 'left' \| 'right', reverse?: bool, scaleType?: 'band' \| 'linear' \| 'log' \| 'point' \| 'pow' \| 'sqrt' \| 'time' \| 'utc', slotProps?: object, slots?: object, stroke?: string, sx?: Array<func \| object \| bool> \| func \| object, tickInterval?: 'auto' \| array \| func, tickLabelInterval?: 'auto' \| func, tickLabelPlacement?: 'middle' \| 'tick', tickLabelStyle?: object, tickMaxStep?: number, tickMinStep?: number, tickNumber?: number, tickPlacement?: 'end' \| 'extremities' \| 'middle' \| 'start', tickSize?: number, valueFormatter?: func, zoom?: { filterMode?: 'discard' \| 'keep', maxEnd?: number, maxSpan?: number, minSpan?: number, minStart?: number, panning?: bool, step?: number } \| bool }>` | - | No |  |
| zAxis | `Array<{ colorMap?: { colors: Array<string>, type: 'ordinal', unknownColor?: string, values?: Array<Date \| number \| string> } \| { color: Array<string> \| func, max?: Date \| number, min?: Date \| number, type: 'continuous' } \| { colors: Array<string>, thresholds: Array<Date \| number>, type: 'piecewise' }, data?: array, dataKey?: string, id?: string, max?: number, min?: number }>` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.

> Any other props supplied will be provided to the root element (native element).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-charts-pro/src/ChartContainerPro/ChartContainerPro.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-charts-pro/src/ChartContainerPro/ChartContainerPro.tsx)