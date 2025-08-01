# GridAggregationFunction API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Aggregation functions](/x/react-data-grid/aggregation/#aggregation-functions)

## Import

```jsx
import { GridAggregationFunction } from '@mui/x-data-grid-premium'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| apply | `(params: GridAggregationParams<V>, api: GridApiPremium) => AV \| null \| undefined` | - | Yes |  |
| applySorting | `boolean` | `false` | No |  |
| columnTypes | `string[]` | - | No |  |
| getCellValue | `(params: GridAggregationGetCellValueParams) => V` | - | No |  |
| hasCellUnit | `boolean` | `true` | No |  |
| label | `string` | `apiRef.current.getLocaleText('aggregationFunctionLabel{capitalize(name)})` | No |  |
| valueFormatter | `GridValueFormatter` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.