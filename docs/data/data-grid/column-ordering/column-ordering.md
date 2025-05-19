---
title: Data Grid - Drag-and-drop column reordering
---

# Data Grid - Drag-and-drop column reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Data Grid Pro lets users drag and drop columns to reorder them.</p>

:::warning
There is [a known issue with Firefox v129](https://github.com/mui/mui-x/issues/14263) that impacts this feature.
Reordering does not work on that specific version of Firefox because the value for `event.dataTransfer` is `null`, which results in an error.

You must upgrade to Firefox v130 or higher to avoid this issue.
:::

By default, columns are organized according to the order in which they're provided in the `columns` array.
The Data Grid Pro lets users reorder columns by dragging and dropping the header cells—give it a try in the demo below:

{{"demo": "ColumnOrderingGrid.js", "bg": "inline"}}

## Column reordering events

Column reordering emits the following events for you to import as needed:

- `columnHeaderDragStart`: emitted when the user starts dragging the header cell.
- `columnHeaderDragEnter`: emitted when the cursor enters another header cell while dragging.
- `columnHeaderDragOver`: emitted when the user drags a header cell over another header cell.
- `columnHeaderDragEnd`: emitted when the user stops dragging the header cell.

## Disable column reordering

### All columns

To disable reordering on all columns, set the `disableColumnReorder` prop to `true`.

### Specific columns

To disable reordering in a specific column, set the `disableReorder` property to `true` in the column's `GridColDef`, as shown below:

{{"demo": "ColumnOrderingDisabledGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
