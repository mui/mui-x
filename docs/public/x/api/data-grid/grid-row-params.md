# GridRowParams API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Master-detail row panels](/x/react-data-grid/master-detail/)

## Import

```jsx
import { GridRowParams } from '@mui/x-data-grid-premium'
// or
import { GridRowParams } from '@mui/x-data-grid-pro'
// or
import { GridRowParams } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| columns | `GridColDef[]` | - | Yes |  |
| id | `GridRowId` | - | Yes |  |
| row | `R` | - | Yes |  |

> **Note**: The `ref` is forwarded to the root element.