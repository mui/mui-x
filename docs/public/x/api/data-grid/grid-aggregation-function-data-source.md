# GridAggregationFunctionDataSource API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Server-side aggregation](/x/react-data-grid/server-side-data/aggregation/)

## Import

```jsx
import { GridAggregationFunctionDataSource } from '@mui/x-data-grid-premium'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| applySorting | `boolean` | `false` | No |  |
| columnTypes | `string[]` | - | No |  |
| hasCellUnit | `boolean` | `true` | No |  |
| label | `string` | `apiRef.current.getLocaleText('aggregationFunctionLabel{capitalize(name)})` | No |  |
| valueFormatter | `GridValueFormatter` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.