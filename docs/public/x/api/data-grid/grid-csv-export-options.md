# GridCsvExportOptions API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [CSV export](/x/react-data-grid/export/#csv-export)

## Import

```jsx
import { GridCsvExportOptions } from '@mui/x-data-grid-premium'
// or
import { GridCsvExportOptions } from '@mui/x-data-grid-pro'
// or
import { GridCsvExportOptions } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| allColumns | `boolean` | `false` | No |  |
| delimiter | `string` | `','` | No |  |
| escapeFormulas | `boolean` | `true` | No |  |
| fields | `string[]` | - | No |  |
| fileName | `string` | `document.title` | No |  |
| getRowsToExport | `(params: GridCsvGetRowsToExportParams) => GridRowId[]` | - | No |  |
| includeColumnGroupsHeaders | `boolean` | `true` | No |  |
| includeHeaders | `boolean` | `true` | No |  |
| utf8WithBom | `boolean` | `false` | No |  |

> **Note**: The `ref` is forwarded to the root element.