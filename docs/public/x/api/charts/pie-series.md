# PieSeries API

## Import

```jsx
import { PieSeries } from '@mui/x-charts-pro'
// or
import { PieSeries } from '@mui/x-charts'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| data | `Readonly<TData[]>` | - | Yes |  |
| type | `'pie'` | - | Yes |  |
| arcLabel | `'formattedValue' \| 'label' \| 'value' \| ((item: Omit<DefaultizedPieValueType, 'label'> & { label?: string }) => string)` | - | No |  |
| arcLabelMinAngle | `number` | `0` | No |  |
| arcLabelRadius | `number \| string` | `(innerRadius - outerRadius) / 2` | No |  |
| color | `string` | - | No |  |
| cornerRadius | `number` | `0` | No |  |
| cx | `number \| string` | `'50%'` | No |  |
| cy | `number \| string` | `'50%'` | No |  |
| endAngle | `number` | `360` | No |  |
| faded | `{ /** * Value added to the default `outerRadius`. * Can be negative. It is ignored if you provide a `faded.outerRadius` value. */ additionalRadius?: number innerRadius?: number outerRadius?: number cornerRadius?: number paddingAngle?: number arcLabelRadius?: number color?: string }` | - | No |  |
| highlighted | `{ /** * Value added to the default `outerRadius`. * Can be negative. It is ignored if you provide a `highlighted.outerRadius` value. */ additionalRadius?: number innerRadius?: number outerRadius?: number cornerRadius?: number paddingAngle?: number arcLabelRadius?: number color?: string }` | - | No |  |
| highlightScope | `HighlightScope` | - | No |  |
| id | `SeriesId` | - | No |  |
| innerRadius | `number \| string` | `0` | No |  |
| labelMarkType | `ChartsLabelMarkType` | - | No |  |
| outerRadius | `number \| string` | `'100%'` | No |  |
| paddingAngle | `number` | `0` | No |  |
| sortingValues | `ChartsPieSorting` | `'none'` | No |  |
| startAngle | `number` | `0` | No |  |
| valueFormatter | `SeriesValueFormatter<TValue>` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.