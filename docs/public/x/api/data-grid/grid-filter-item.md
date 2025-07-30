# GridFilterItem API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Custom filter operator](/x/react-data-grid/filtering/customization/#create-a-custom-operator)

## Import

```jsx
import { GridFilterItem } from '@mui/x-data-grid-premium'
// or
import { GridFilterItem } from '@mui/x-data-grid-pro'
// or
import { GridFilterItem } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| field | `string` | - | Yes |  |
| operator | `string` | - | Yes |  |
| id | `number \| string` | - | No |  |
| value | `any` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.