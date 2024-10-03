---
title: Data Grid - Column ordering
---

# Data Grid - Column ordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Drag and drop your columns to reorder them.</p>

:::warning
There is [a known issue with Firefox v129](https://github.com/mui/mui-x/issues/14263) that impacts this feature.
Reordering does not work on that specific version of Firefox because the value for `event.dataTransfer` is `null` which results in an error.

You must upgrade to Firefox v130 or higher to avoid this issue.
:::

By default, columns are ordered according to the order they are included in the `columns` array.

By default, `DataGridPro` allows all column reordering by dragging the header cells and moving them left or right.

{{"demo": "ColumnOrderingGrid.js", "bg": "inline"}}

To disable reordering on all columns, set the prop `disableColumnReorder={true}`.

To disable reordering in a specific column, set the `disableReorder` property to true in the `GridColDef` of the respective column.

{{"demo": "ColumnOrderingDisabledGrid.js", "bg": "inline"}}

In addition, column reordering emits the following events that can be imported:

- `columnHeaderDragStart`: emitted when dragging of a header cell starts.
- `columnHeaderDragEnter`: emitted when the cursor enters another header cell while dragging.
- `columnHeaderDragOver`: emitted when dragging a header cell over another header cell.
- `columnHeaderDragEnd`: emitted when dragging of a header cell stops.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
