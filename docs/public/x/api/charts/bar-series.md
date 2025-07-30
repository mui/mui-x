# BarSeries API

## Import

```jsx
import { BarSeries } from '@mui/x-charts-pro'
// or
import { BarSeries } from '@mui/x-charts'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `'bar'` | - | Yes |  |
| color | `string` | - | No |  |
| data | `readonly (number \| null)[]` | - | No |  |
| dataKey | `string` | - | No |  |
| highlightScope | `HighlightScope` | - | No |  |
| id | `SeriesId` | - | No |  |
| label | `string \| ((location: 'tooltip' \| 'legend') => string)` | - | No |  |
| labelMarkType | `ChartsLabelMarkType` | - | No |  |
| layout | `'horizontal' \| 'vertical'` | `'vertical'` | No |  |
| minBarSize | `number` | `0px` | No |  |
| stack | `string` | - | No |  |
| stackOffset | `StackOffsetType` | `'diverging'` | No |  |
| stackOrder | `StackOrderType` | `'none'` | No |  |
| valueFormatter | `SeriesValueFormatter<TValue>` | - | No |  |
| xAxisId | `string` | - | No |  |
| yAxisId | `string` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.