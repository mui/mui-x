---
title: Data Grid - Drag-and-drop column reordering
---

# Data Grid - Drag-and-drop column reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Data Grid Pro lets users drag and drop columns to reorder them.</p>

Columns are organized according to the order in which they're provided in the `columns` array.
By default, the Data Grid Pro lets users reorder columns by dragging and dropping the header cells—give it a try in the demo below:

{{"component": "file://./demos/column-ordering-grid/index.ts", "bg": "inline"}}

## Column reordering events

Column reordering emits the following events:

- `columnHeaderDragStart`: emitted when the user starts dragging the header cell.
- `columnHeaderDragEnter`: emitted when the cursor enters another header cell while dragging.
- `columnHeaderDragOver`: emitted when the user drags a header cell over another header cell.
- `columnHeaderDragEnd`: emitted when the user stops dragging the header cell.

These events are only emitted for mouse drags. Touch and pen drags only call `onColumnOrderChange`.
`onColumnOrderChange` is not called when the column is dropped back at its original position.

A touch or pen drag can be released anywhere inside the Data Grid, including the column group headers, the toolbar, and the footer: the column keeps the position it was dragged to.
Releasing outside the Data Grid moves the column back to its original position, unless `keepColumnPositionIfDraggedOutside` is enabled.

## Disabling column reordering

Drag-and-drop column reordering is enabled by default on the Data Grid Pro, but you can disable it for some or all columns.

### For all columns

To disable reordering for all columns, set the `disableColumnReorder` prop to `true`:

```tsx
<DataGridPro disableColumnReorder />
```

### For specific columns

To disable reordering for a specific column, set the `disableReorder` property to `true` in the column's `GridColDef`, as shown below:

{{"component": "file://./demos/column-ordering-disabled-grid/index.ts", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
