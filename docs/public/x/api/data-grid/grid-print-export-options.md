# GridPrintExportOptions API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Print export](/x/react-data-grid/export/#print-export)

## Import

```jsx
import { GridPrintExportOptions } from '@mui/x-data-grid-premium'
// or
import { GridPrintExportOptions } from '@mui/x-data-grid-pro'
// or
import { GridPrintExportOptions } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| allColumns | `boolean` | `false` | No |  |
| bodyClassName | `string` | - | No |  |
| copyStyles | `boolean` | `true` | No |  |
| fields | `string[]` | - | No |  |
| fileName | `string` | `The title of the page.` | No |  |
| getRowsToExport | `(params: GridPrintGetRowsToExportParams) => GridRowId[]` | - | No |  |
| hideFooter | `boolean` | `false` | No |  |
| hideToolbar | `boolean` | `false` | No |  |
| includeCheckboxes | `boolean` | `false` | No |  |
| pageStyle | `string \| (() => string)` | - | No |  |

> **Note**: The `ref` is forwarded to the root element.