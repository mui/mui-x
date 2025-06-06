---
title: Data Grid - Drag-and-drop column reordering
---

# Data Grid - Drag-and-drop column reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Data Grid Pro lets users drag and drop columns to reorder them.</p>

Columns are organized according to the order in which they're provided in the `columns` array.
By default, the Data Grid Pro lets users reorder columns by dragging and dropping the header cells—give it a try in the demo below:

{{"demo": "ColumnOrderingGrid.js", "bg": "inline"}}

## Column reordering events

Column reordering emits the following events:

- `columnHeaderDragStart`: emitted when the user starts dragging the header cell.
- `columnHeaderDragEnter`: emitted when the cursor enters another header cell while dragging.
- `columnHeaderDragOver`: emitted when the user drags a header cell over another header cell.
- `columnHeaderDragEnd`: emitted when the user stops dragging the header cell.

## Disabling column reordering

Drag-and-drop column reordering is enabled by default on the Data Grid Pro, but you can disable it for some or all columns.

### For all columns

To disable reordering for all columns, set the `disableColumnReorder` prop to `true`:

```tsx
<DataGridPro disableColumnReorder />
```

### For specific columns

To disable reordering for a specific column, set the `disableReorder` property to `true` in the column's `GridColDef`, as shown below:

{{"demo": "ColumnOrderingDisabledGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
