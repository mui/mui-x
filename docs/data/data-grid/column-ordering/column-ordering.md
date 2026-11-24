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

These events are only emitted for mouse drags. Touch and pen drags only call `onColumnOrderChange`.
`onColumnOrderChange` is not called when the column is dropped back at its original position.

A touch or pen drag can be released anywhere inside the Data Grid, including the column group headers, the toolbar, and the footer: the column keeps the position it was dragged to.
Releasing outside the Data Grid moves the column back to its original position, unless `keepColumnPositionIfDraggedOutside` is enabled.

## Keyboard reordering

Users can also move columns with the keyboard:

- <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Left</kbd></kbd> and <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Arrow Right</kbd></kbd> move the column of the focused cell or column header by one position.
- <kbd><kbd class="key">Alt</kbd>+<kbd class="key">Home</kbd></kbd> and <kbd><kbd class="key">Alt</kbd>+<kbd class="key">End</kbd></kbd> on a column header move its column as far as allowed toward the start or the end.

On macOS, use <kbd class="key">⌥ Option</kbd> instead of <kbd class="key">Alt</kbd>.
In right-to-left layouts, the arrow keys follow the visual direction.

A keyboard move follows the same rules as a drag: [pinned](/x/react-data-grid/column-pinning/) columns and columns with `disableReorder` can't be moved, and a column doesn't enter a pinned section or leave its [column group](/x/react-data-grid/column-groups/) unless the group allows `freeReordering`.
`onColumnOrderChange` is called once per key press.

While the keyboard is in use, the header of the column that a key press would move has a blue tint, with the `columnHeader--reorderTarget` class.
Screen readers announce the new position after each move, or the reason why the column can't move.

To turn off a key from a cell, set `event.defaultMuiPrevented` in `onCellKeyDown()`.
From a column header, do the same in a `columnHeaderKeyDown` listener registered with `isFirst`:

```tsx
apiRef.current.subscribeEvent(
  'columnHeaderKeyDown',
  (params, event) => {
    if (event.altKey) {
      event.defaultMuiPrevented = true;
    }
  },
  { isFirst: true },
);
```

## Disabling column reordering

Column reordering is enabled by default on the Data Grid Pro, for drag and drop and for the keyboard, but you can disable it for some or all columns.

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
