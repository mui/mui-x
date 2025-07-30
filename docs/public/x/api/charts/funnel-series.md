# FunnelSeries API

## Import

```jsx
import { FunnelSeries } from '@mui/x-charts-pro'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| data | `Readonly<FunnelValueType[]>` | - | Yes |  |
| type | `'funnel'` | - | Yes |  |
| borderRadius | `number` | `8` | No |  |
| curve | `FunnelCurveType` | `'linear'` | No |  |
| funnelDirection | `'increasing' \| 'decreasing' \| 'auto'` | `'auto'` | No |  |
| highlightScope | `HighlightScope` | - | No |  |
| id | `SeriesId` | - | No |  |
| label | `string \| ((location: 'tooltip' \| 'legend') => string)` | - | No |  |
| labelMarkType | `ChartsLabelMarkType` | - | No |  |
| layout | `'horizontal' \| 'vertical'` | `'vertical'` | No |  |
| sectionLabel | `FunnelLabelOptions \| ((item: FunnelItem) => FunnelLabelOptions \| false) \| false` | `{ vertical: 'middle', horizontal: 'center' }` | No |  |
| valueFormatter | `SeriesValueFormatter<TValue>` | - | No |  |
| variant | `'filled' \| 'outlined'` | `'filled'` | No |  |
| xAxisId | `string` | - | No |  |
| yAxisId | `string` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.