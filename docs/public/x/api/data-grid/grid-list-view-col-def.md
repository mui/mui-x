# GridListViewColDef API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [List view](/x/react-data-grid/list-view/)

## Import

```jsx
import { GridListViewColDef } from '@mui/x-data-grid-premium'
// or
import { GridListViewColDef } from '@mui/x-data-grid-pro'
// or
import { GridListViewColDef } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| field | `string` | - | Yes |  |
| align | `GridAlignment` | - | No |  |
| cellClassName | `GridCellClassNamePropType<R, V>` | - | No |  |
| display | `'text' \| 'flex'` | - | No |  |
| renderCell | `(params: GridRenderCellParams<R, V, F>) => React.ReactNode` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.