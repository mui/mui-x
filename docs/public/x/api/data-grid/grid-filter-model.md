# GridFilterModel API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Pass filters to the grid](/x/react-data-grid/filtering/#pass-filters-to-the-data-grid)

## Import

```jsx
import { GridFilterModel } from '@mui/x-data-grid-premium'
// or
import { GridFilterModel } from '@mui/x-data-grid-pro'
// or
import { GridFilterModel } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| items | `GridFilterItem[]` | `[]` | Yes |  |
| logicOperator | `GridLogicOperator` | `GridLogicOperator.And` | No |  |
| quickFilterExcludeHiddenColumns | `boolean` | `true` | No |  |
| quickFilterLogicOperator | `GridLogicOperator` | `GridLogicOperator.And` | No |  |
| quickFilterValues | `any[]` | `[]` | No |  |

> **Note**: The `ref` is forwarded to the root element.