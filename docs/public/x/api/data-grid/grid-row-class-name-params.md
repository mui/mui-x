# GridRowClassNameParams API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Styling rows](/x/react-data-grid/style/#styling-rows)

## Import

```jsx
import { GridRowClassNameParams } from '@mui/x-data-grid-premium'
// or
import { GridRowClassNameParams } from '@mui/x-data-grid-pro'
// or
import { GridRowClassNameParams } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| columns | `GridColDef[]` | - | Yes |  |
| id | `GridRowId` | - | Yes |  |
| indexRelativeToCurrentPage | `number` | - | Yes |  |
| isFirstVisible | `boolean` | - | Yes |  |
| isLastVisible | `boolean` | - | Yes |  |
| row | `R` | - | Yes |  |

> **Note**: The `ref` is forwarded to the root element.