# GridCellParams API

## Import

```jsx
import { GridCellParams } from '@mui/x-data-grid-premium'
// or
import { GridCellParams } from '@mui/x-data-grid-pro'
// or
import { GridCellParams } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| api | `GridApiCommunity` | - | Yes |  |
| cellMode | `GridCellMode` | - | Yes |  |
| colDef | `GridStateColDef` | - | Yes |  |
| field | `string` | - | Yes |  |
| hasFocus | `boolean` | - | Yes |  |
| id | `GridRowId` | - | Yes |  |
| row | `GridRowModel<R>` | - | Yes |  |
| rowNode | `N` | - | Yes |  |
| tabIndex | `0 \| -1` | - | Yes |  |
| formattedValue | `F \| undefined` | - | No |  |
| isEditable | `boolean` | - | No |  |
| value | `V \| undefined` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.