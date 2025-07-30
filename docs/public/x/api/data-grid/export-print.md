# ExportPrint API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Export component](/x/react-data-grid/components/export)

## Import

```jsx
import { ExportPrint } from '@mui/x-data-grid/components';
// or
import { ExportPrint } from '@mui/x-data-grid';
// or
import { ExportPrint } from '@mui/x-data-grid-pro';
// or
import { ExportPrint } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| options | `{ allColumns?: bool, bodyClassName?: string, copyStyles?: bool, fields?: Array<string>, fileName?: string, getRowsToExport?: func, hideFooter?: bool, hideToolbar?: bool, includeCheckboxes?: bool, pageStyle?: func \| string }` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/export/ExportPrint.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/export/ExportPrint.tsx)