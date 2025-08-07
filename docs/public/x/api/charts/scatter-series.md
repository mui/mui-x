# ScatterSeries API

## Import

```jsx
import { ScatterSeries } from '@mui/x-charts-pro'
// or
import { ScatterSeries } from '@mui/x-charts'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `'scatter'` | - | Yes |  |
| color | `string` | - | No |  |
| data | `readonly ScatterValueType[]` | - | No |  |
| datasetKeys | `{ /** * The key used to retrieve data from the dataset for the X axis. */ x: string /** * The key used to retrieve data from the dataset for the Y axis. */ y: string /** * The key used to retrieve data from the dataset for the Z axis. */ z?: string /** * The key used to retrieve data from the dataset for the id. */ id?: string }` | - | No |  |
| disableHover | `boolean` | `false` | No |  |
| highlightScope | `HighlightScope` | - | No |  |
| id | `SeriesId` | - | No |  |
| label | `string \| ((location: 'tooltip' \| 'legend') => string)` | - | No |  |
| labelMarkType | `ChartsLabelMarkType` | - | No |  |
| markerSize | `number` | - | No |  |
| preview | `{ /** * The size of the preview marker in pixels. * @default 1 */ markerSize?: number }` | - | No |  |
| valueFormatter | `SeriesValueFormatter<TValue>` | - | No |  |
| xAxisId | `string` | - | No |  |
| yAxisId | `string` | - | No |  |
| zAxisId | `string` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.