# LineSeries API

## Import

```jsx
import { LineSeries } from '@mui/x-charts-pro'
// or
import { LineSeries } from '@mui/x-charts'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `'line'` | - | Yes |  |
| area | `boolean` | - | No |  |
| baseline | `number \| 'min' \| 'max'` | `0` | No |  |
| color | `string` | - | No |  |
| connectNulls | `boolean` | `false` | No |  |
| curve | `CurveType` | `'monotoneX'` | No |  |
| data | `readonly (number \| null)[]` | - | No |  |
| dataKey | `string` | - | No |  |
| disableHighlight | `boolean` | `false` | No |  |
| highlightScope | `HighlightScope` | - | No |  |
| id | `SeriesId` | - | No |  |
| label | `string \| ((location: 'tooltip' \| 'legend') => string)` | - | No |  |
| labelMarkType | `ChartsLabelMarkType` | - | No |  |
| shape | `'circle' \| 'cross' \| 'diamond' \| 'square' \| 'star' \| 'triangle' \| 'wye'` | `'circle'` | No |  |
| showMark | `boolean \| ((params: ShowMarkParams) => boolean)` | - | No |  |
| stack | `string` | - | No |  |
| stackOffset | `StackOffsetType` | `'none'` | No |  |
| stackOrder | `StackOrderType` | `'none'` | No |  |
| strictStepCurve | `boolean` | - | No |  |
| valueFormatter | `SeriesValueFormatter<TValue>` | - | No |  |
| xAxisId | `string` | - | No |  |
| yAxisId | `string` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.