# GridFilterOperator API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom filter operator](/x/react-data-grid/filtering/customization/#create-a-custom-operator)

## Import

```jsx
import { GridFilterOperator } from '@mui/x-data-grid-premium'
// or
import { GridFilterOperator } from '@mui/x-data-grid-pro'
// or
import { GridFilterOperator } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| getApplyFilterFn | `GetApplyFilterFn<R, V, F>` | - | Yes |  |
| value | `string` | - | Yes |  |
| getValueAsString | `(value: GridFilterItem['value']) => string` | - | No |  |
| headerLabel | `string` | - | No |  |
| InputComponent | `React.JSXElementConstructor<I>` | - | No |  |
| InputComponentProps | `Partial<I>` | - | No |  |
| label | `string` | - | No |  |
| requiresFilterValue | `boolean` | `true` | No |  |

> **Note**: The `ref` is forwarded to the root element.