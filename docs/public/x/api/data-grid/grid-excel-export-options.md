# GridExcelExportOptions API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Excel export](/x/react-data-grid/export/#excel-export)

## Import

```jsx
import { GridExcelExportOptions } from '@mui/x-data-grid-premium'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| allColumns | `boolean` | `false` | No |  |
| columnsStyles | `ColumnsStylesInterface` | - | No |  |
| escapeFormulas | `boolean` | `true` | No |  |
| exceljsPostProcess | `(processInput: GridExceljsProcessInput) => Promise<void>` | - | No |  |
| exceljsPreProcess | `(processInput: GridExceljsProcessInput) => Promise<void>` | - | No |  |
| fields | `string[]` | - | No |  |
| fileName | `string` | `document.title` | No |  |
| getRowsToExport | `(params: GridGetRowsToExportParams<Api>) => GridRowId[]` | - | No |  |
| includeColumnGroupsHeaders | `boolean` | `true` | No |  |
| includeHeaders | `boolean` | `true` | No |  |
| valueOptionsSheetName | `string` | - | No |  |
| worker | `() => Worker` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.